const admin = require("firebase-admin");
const { HttpsError, onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { Resend } = require("resend");

admin.initializeApp();

const resendApiKey = defineSecret("RESEND_API_KEY");

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

exports.sendNotificationEmail = onCall(
  {
    cors: true,
    maxInstances: 10,
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

    const to = assertString(request.data?.to, "Recipient email", 320);
    const subject = assertString(request.data?.subject, "Subject", 200);
    const html = assertString(request.data?.html, "Email HTML", 500000);
    const from = process.env.RESEND_FROM_EMAIL || "FlashTransacts <onboarding@resend.dev>";
    const replyTo = process.env.RESEND_REPLY_TO || undefined;
    const apiKey = resendApiKey.value() || process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new HttpsError("failed-precondition", "RESEND_API_KEY is not configured for Firebase Functions.");
    }

    try {
      const resend = new Resend(apiKey);
      const response = await resend.emails.send({
        from,
        to,
        subject,
        html,
        replyTo,
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
      throw new HttpsError("internal", "Email delivery failed. Check Resend domain and sender settings.");
    }
  }
);
