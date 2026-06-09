import { renderToStaticMarkup } from "react-dom/server";
import { renderEmailTemplate, type EmailPreviewData } from "@/lib/emailTemplates";

export function renderEmailHtml(data: EmailPreviewData) {
  const markup = renderToStaticMarkup(renderEmailTemplate(data));

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f3f4f6;">${markup}</body></html>`;
}
