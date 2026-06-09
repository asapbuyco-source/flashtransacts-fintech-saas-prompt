const { Resend } = require("resend");
const juiceModule = require("juice");
const juice = juiceModule.default || juiceModule;

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

const rateLimits = new Map();

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function assertString(value, field, maxLength) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }

  if (value.length > maxLength) {
    throw new Error(`${field} is too long.`);
  }

  return value.trim();
}

function assertEmail(value, field) {
  const email = assertString(value, field, 320);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new Error(`${field} must be a valid email address.`);
  }

  return email;
}

function sanitizeDisplayName(value) {
  const cleaned = String(value || "")
    .replace(/[<>"\r\n]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || cleaned.includes("@")) {
    return "FlashTransacts";
  }

  return cleaned.slice(0, 80);
}

function normalizeFromAddress(value) {
  const configured = assertString(value, "RESEND_FROM_DOMAIN", 320);

  if (configured.includes("@")) {
    return assertEmail(configured, "RESEND_FROM_DOMAIN");
  }

  return `notify@${configured.replace(/^@+/, "")}`;
}

function getSenderName(payload) {
  const brand = sanitizeDisplayName(payload.brand);
  const senderName = sanitizeDisplayName(payload.senderName);

  return senderName === "FlashTransacts" ? brand : senderName;
}

function checkRateLimit(key, limits, label) {
  const now = Date.now();
  const iso = new Date(now).toISOString();
  const hourKey = iso.slice(0, 13);
  const dayKey = iso.slice(0, 10);
  const state = rateLimits.get(key) || {};
  const lastSentAt = Number(state.lastSentAt || 0);
  const elapsed = now - lastSentAt;

  if (lastSentAt && elapsed < limits.minIntervalMs) {
    const seconds = Math.ceil((limits.minIntervalMs - elapsed) / 1000);
    throw new Error(`${label} is sending too quickly. Try again in ${seconds} seconds.`);
  }

  const hourlyCount = state.hourKey === hourKey ? Number(state.hourlyCount || 0) : 0;
  if (hourlyCount >= limits.perHour) {
    throw new Error(`${label} reached the hourly email limit. Try again later.`);
  }

  const dailyCount = state.dayKey === dayKey ? Number(state.dailyCount || 0) : 0;
  if (dailyCount >= limits.perDay) {
    throw new Error(`${label} reached the daily email limit. Try again tomorrow.`);
  }

  rateLimits.set(key, {
    dayKey,
    dailyCount: dailyCount + 1,
    hourKey,
    hourlyCount: hourlyCount + 1,
    lastSentAt: now,
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const to = assertEmail(payload.to, "Recipient email");
    const subject = assertString(payload.subject, "Subject", 200);
    const html = assertString(payload.html, "Email HTML", 500000);
    const inlinedHtml = juice(html, {
      preserveMediaQueries: true,
      removeStyleTags: false,
    });
    const senderName = getSenderName(payload);
    const apiKey = assertString(process.env.RESEND_API_KEY, "RESEND_API_KEY", 500);
    const fromAddress = normalizeFromAddress(process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM_DOMAIN);
    const replyTo = process.env.RESEND_REPLY_TO || undefined;
    const userKey = String(payload.userId || payload.userEmail || to).slice(0, 160);

    checkRateLimit("global", GLOBAL_LIMITS, "The mail server");
    checkRateLimit(`user:${userKey}`, USER_LIMITS, "Your account");

    const resend = new Resend(apiKey);
    const response = await resend.emails.send({
      from: `${senderName} <${fromAddress}>`,
      to,
      subject,
      html: inlinedHtml,
      replyTo,
      headers: {
        "X-FlashTransacts-Notification": String(payload.notificationId || ""),
      },
    });

    if (response.error) {
      return json(502, { error: response.error.message || "Resend rejected the email." });
    }

    return json(200, { id: response.data?.id || "" });
  } catch (error) {
    return json(400, {
      error: error instanceof Error ? error.message : "Email delivery failed.",
    });
  }
};
