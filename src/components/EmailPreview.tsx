import { renderEmailTemplate, type EmailPreviewData } from "@/lib/emailTemplates";

export default function EmailPreview({ data }: { data: EmailPreviewData; compact?: boolean }) {
  return renderEmailTemplate(data);
}
