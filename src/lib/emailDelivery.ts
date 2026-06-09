import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { renderEmailHtml } from "@/lib/emailHtml";
import { getEmailSubject, type EmailPreviewData } from "@/lib/emailTemplates";

type SendEmailResponse = {
  id: string;
};

const sendNotificationEmailCallable = httpsCallable<
  {
    html: string;
    notificationId?: string;
    subject: string;
    to: string;
  },
  SendEmailResponse
>(functions, "sendNotificationEmail");

export async function sendNotificationEmail(data: EmailPreviewData) {
  const to = data.recipient || data.metadata?.recipientEmail;

  if (!to) {
    throw new Error("Recipient email is required before sending.");
  }

  const result = await sendNotificationEmailCallable({
    html: renderEmailHtml(data),
    notificationId: data.id,
    subject: getEmailSubject(data),
    to,
  });

  return result.data;
}
