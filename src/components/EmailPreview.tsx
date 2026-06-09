import { renderEmailHtml } from "@/lib/emailHtml";
import type { EmailPreviewData } from "@/lib/emailTemplates";

export default function EmailPreview({ data, compact = false }: { data: EmailPreviewData; compact?: boolean }) {
  const html = renderEmailHtml(data);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-black/10 bg-[#f3f4f6]">
      <iframe
        title="Email preview"
        srcDoc={html}
        className="block w-full border-0 bg-[#f3f4f6]"
        style={{ height: compact ? 560 : 760 }}
      />
    </div>
  );
}
