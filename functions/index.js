const admin = require("firebase-admin");
const { HttpsError, onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { Resend } = require("resend");

admin.initializeApp();

const resendApiKey = defineSecret("RESEND_API_KEY");

const USER_LIMITS = {
  minIntervalMs: 60 * 1000,
  perHour: 20,
  perDay: 80,
};

const GLOBAL_LIMITS = {
  minIntervalMs: 10 * 1000,
  perHour: 80,
  perDay: 90,
};

function isSubscriptionActive(user) {
  if (!user || user.status !== "active") {
    return false;
  }

  if (user.subscriptionType === "Lifetime") {
    return true;
  }

  if (!user.subscriptionEnd) {
    return false;
  }

  return new Date(user.subscriptionEnd).getTime() >= Date.now();
}

function assertString(value, field, maxLength) {
  if (typeof value !== "string" || !value.trim()) {
    throw new HttpsError("invalid-argument", `${field} is required.`);
  }

  if (value.length > maxLength) {
    throw new HttpsError("invalid-argument", `${field} is too long.`);
  }

  return value.trim();
}

function assertEmail(value, field) {
  const email = assertString(value, field, 320);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new HttpsError("invalid-argument", `${field} must be a valid email address.`);
  }

  return email;
}

function sanitizeDisplayName(value) {
  return String(value || "FlashTransacts")
    .replace(/[<>"\r\n]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80) || "FlashTransacts";
}

function nextRateLimitState(current, limits, label, now, hourKey, dayKey) {
  const state = current || {};
  const lastSentAt = Number(state.lastSentAt || 0);
  const elapsed = now - lastSentAt;

  if (lastSentAt && elapsed < limits.minIntervalMs) {
    const seconds = Math.ceil((limits.minIntervalMs - elapsed) / 1000);
    throw new HttpsError("resource-exhausted", `${label} is sending too quickly. Try again in ${seconds} seconds.`);
  }

  const hourlyCount = state.hourKey === hourKey ? Number(state.hourlyCount || 0) : 0;
  if (hourlyCount >= limits.perHour) {
    throw new HttpsError("resource-exhausted", `${label} reached the hourly email limit. Try again later.`);
  }

  const dailyCount = state.dayKey === dayKey ? Number(state.dailyCount || 0) : 0;
  if (dailyCount >= limits.perDay) {
    throw new HttpsError("resource-exhausted", `${label} reached the daily email limit. Try again tomorrow.`);
  }

  return {
    dayKey,
    dailyCount: dailyCount + 1,
    hourKey,
    hourlyCount: hourlyCount + 1,
    lastSentAt: now,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

async function enforceRateLimits(uid) {
  const db = admin.firestore();
  const userLimitRef = db.collection("mailRateLimits").doc(uid);
  const globalLimitRef = db.collection("mailRateLimits").doc("_global");
  const now = Date.now();
  const iso = new Date(now).toISOString();
  const hourKey = iso.slice(0, 13);
  const dayKey = iso.slice(0, 10);

  await db.runTransaction(async (transaction) => {
    const userSnapshot = await transaction.get(userLimitRef);
    const globalSnapshot = await transaction.get(globalLimitRef);
    const nextUserState = nextRateLimitState(userSnapshot.data(), USER_LIMITS, "Your account", now, hourKey, dayKey);
    const nextGlobalState = nextRateLimitState(globalSnapshot.data(), GLOBAL_LIMITS, "The mail server", now, hourKey, dayKey);

    transaction.set(userLimitRef, nextUserState, { merge: true });
    transaction.set(globalLimitRef, nextGlobalState, { merge: true });
  });
}

exports.sendNotificationEmail = onCall(
  {
    cors: true,
    maxInstances: 5,
    region: "us-central1",
    secrets: [resendApiKey],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in before sending email.");
    }

    const userSnapshot = await admin.firestore().collection("users").doc(request.auth.uid).get();
    const user = userSnapshot.data();
    const isAdmin = user?.role === "super_admin" || user?.role === "admin";

    if (!isAdmin && !isSubscriptionActive(user)) {
      throw new HttpsError("permission-denied", "Your subscription must be activated by the admin before sending email.");
    }

    const to = assertEmail(request.data?.to, "Recipient email");
    const subject = assertString(request.data?.subject, "Subject", 200);
    const html = assertString(request.data?.html, "Email HTML", 500000);
    const senderName = sanitizeDisplayName(request.data?.senderName || request.data?.brand);
    const apiKey = resendApiKey.value() || process.env.RESEND_API_KEY;
    const fromDomain = assertString(process.env.RESEND_FROM_DOMAIN, "Resend sender domain", 253);
    const replyTo = process.env.RESEND_REPLY_TO || undefined;

    if (!apiKey) {
      throw new HttpsError("failed-precondition", "RESEND_API_KEY is not configured for Firebase Functions.");
    }

    await enforceRateLimits(request.auth.uid);

    try {
      const resend = new Resend(apiKey);
      const response = await resend.emails.send({
        from: `${senderName} <notify@${fromDomain}>`,
        to,
        subject,
        html,
        replyTo,
        headers: {
          "X-FlashTransacts-Notification": request.data?.notificationId || "",
        },
      });

      if (response.error) {
        logger.error("Resend delivery failed", response.error);
        throw new HttpsError("internal", response.error.message || "Resend rejected the email.");
      }

      return { id: response.data?.id || "" };
    } catch (error) {
      if (error instanceof HttpsError) {
        throw error;
      }

      logger.error("Email delivery failed", error);
      throw new HttpsError("internal", "Email delivery failed. Check the Resend API key, verified domain, and sending limits.");
    }
  }
);
