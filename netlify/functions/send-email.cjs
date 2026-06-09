const { Resend } = require("resend");

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

const BRAND_SENDERS = {
  "Apple Pay": { name: "Apple Pay Receipt", localPart: "applepay" },
  Binance: { name: "Binance", localPart: "binance" },
  "Cash App": { name: "Cash App Notice", localPart: "cashapp" },
  Chime: { name: "Chime", localPart: "chime" },
  Coinbase: { name: "Coinbase", localPart: "coinbase" },
  Custom: { name: "FlashTransacts", localPart: "notify" },
  Interac: { name: "Interac", localPart: "interac" },
  PayPal: { name: "PayPal Receipt", localPart: "paypal" },
  Venmo: { name: "Venmo", localPart: "venmo" },
  Zelle: { name: "Zelle Transfer Notice", localPart: "zelle" },
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

function senderDomainFromEnv(value) {
  const configured = assertString(value, "RESEND_FROM_DOMAIN", 320);
  const domain = configured.includes("@") ? configured.split("@").pop() : configured;
  const cleaned = domain.replace(/^@+/, "").trim().toLowerCase();

  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(cleaned)) {
    throw new Error("RESEND_FROM_DOMAIN must be a verified domain, such as flashtransacts.xyz.");
  }

  return cleaned;
}

function brandSenderProfile(payload) {
  const brand = sanitizeDisplayName(payload.brand);
  return BRAND_SENDERS[brand] || {
    name: brand,
    localPart: brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "notify",
  };
}

function getSenderName(payload) {
  return brandSenderProfile(payload).name;
}

function getFromAddress(payload, configuredSender) {
  const domain = senderDomainFromEnv(configuredSender);
  const localPart = brandSenderProfile(payload).localPart;

  return assertEmail(`${localPart}@${domain}`, "Sender email");
}

function formatFrom(senderName, fromAddress) {
  const escapedName = senderName.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${escapedName}" <${fromAddress}>`;
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

function htmlToText(html) {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
    .slice(0, 5000);
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
    const senderName = getSenderName(payload);
    const apiKey = assertString(process.env.RESEND_API_KEY, "RESEND_API_KEY", 500);
    const fromAddress = getFromAddress(payload, process.env.RESEND_FROM_DOMAIN || process.env.RESEND_FROM_EMAIL);
    const replyTo = process.env.RESEND_REPLY_TO || undefined;
    const userKey = String(payload.userId || payload.userEmail || to).slice(0, 160);

    checkRateLimit("global", GLOBAL_LIMITS, "The mail server");
    checkRateLimit(`user:${userKey}`, USER_LIMITS, "Your account");

    const text = htmlToText(html);
    const resend = new Resend(apiKey);
    const from = formatFrom(senderName, fromAddress);
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      replyTo,
      headers: {
        "Auto-Submitted": "auto-generated",
        "X-FlashTransacts-Notification": String(payload.notificationId || ""),
        "X-Auto-Response-Suppress": "All",
        "Precedence": "bulk",
        "MIME-Version": "1.0",
      },
    });

    if (response.error) {
      console.error("Resend rejected email", {
        error: response.error,
        from,
        to,
      });

      return json(502, {
        error: response.error.message || "Resend rejected the email.",
        details: response.error,
        from,
      });
    }

    return json(200, { from, id: response.data?.id || "" });
  } catch (error) {
    console.error("Send email function failed", error);

    return json(400, {
      error: error instanceof Error ? error.message : "Email delivery failed.",
    });
  }
};
