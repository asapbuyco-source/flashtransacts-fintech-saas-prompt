import { renderEmailHtml } from "@/lib/emailHtml";
import { getEmailSubject, type EmailPreviewData } from "@/lib/emailTemplates";

type SendEmailResponse = {
  details?: unknown;
  error?: string;
  from?: string;
  id: string;
};

export async function sendNotificationEmail(data: EmailPreviewData) {
  const to = data.recipient || data.metadata?.recipientEmail;

  if (!to) {
    throw new Error("Recipient email is required before sending.");
  }

  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      brand: data.brand,
      html: renderEmailHtml(data),
      notificationId: data.id,
      senderName: data.brand || data.type || "FlashTransacts",
      subject: getEmailSubject(data),
      to,
      userId: data.createdBy,
      userEmail: data.metadata?.userEmail,
    }),
  });

  const result = (await response.json()) as SendEmailResponse;

  if (!response.ok) {
    const details =
      result.details && typeof result.details === "object"
        ? ` ${JSON.stringify(result.details)}`
        : "";
    const from = result.from ? ` Sender: ${result.from}.` : "";

    throw new Error(`${result.error || "Email delivery failed."}${from}${details}`);
  }

  return result;
}
