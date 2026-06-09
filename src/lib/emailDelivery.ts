import { renderEmailHtml } from "@/lib/emailHtml";
import { getEmailSubject, type EmailPreviewData } from "@/lib/emailTemplates";

type SendEmailResponse = {
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

  const result = (await response.json()) as SendEmailResponse & { error?: string };

  if (!response.ok) {
    throw new Error(result.error || "Email delivery failed.");
  }

  return result;
}
