import { renderToStaticMarkup } from "react-dom/server";
import juice from "juice/client";
import { renderEmailTemplate, type EmailPreviewData } from "@/lib/emailTemplates";

const escapeCssClassName = (className: string) =>
  className.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");

const utilityRule = (className: string, declaration: string) =>
  `.${escapeCssClassName(className)} { ${declaration} }`;

const escapedArbitraryCss = [
  ["border-[14px]", "border-width: 14px; border-style: solid;"],
  ["border-[#0052FF]", "border-color: #0052FF;"],
  ["border-[#4b4d50]", "border-color: #4b4d50;"],
  ["border-[#777]", "border-color: #777;"],
  ["border-[#c7c7c7]", "border-color: #c7c7c7;"],
  ["border-[#ccc]", "border-color: #ccc;"],
  ["border-[#d7d7d7]", "border-color: #d7d7d7;"],
  ["border-[#ddd]", "border-color: #ddd;"],
  ["border-[#e1e1e1]", "border-color: #e1e1e1;"],
  ["border-[#e5e7eb]", "border-color: #e5e7eb;"],
  ["border-[#f5c6cb]", "border-color: #f5c6cb;"],
  ["bg-[#0052FF]", "background-color: #0052FF;"],
  ["bg-[#0070ba]", "background-color: #0070ba;"],
  ["bg-[#007BFF]", "background-color: #007BFF;"],
  ["bg-[#00C774]", "background-color: #00C774;"],
  ["bg-[#050505]", "background-color: #050505;"],
  ["bg-[#10a8df]", "background-color: #10a8df;"],
  ["bg-[#181A20]", "background-color: #181A20;"],
  ["bg-[#3D95CE]", "background-color: #3D95CE;"],
  ["bg-[#7f5bf6]", "background-color: #7f5bf6;"],
  ["bg-[#D4AF37]", "background-color: #D4AF37;"],
  ["bg-[#f3ba2f]", "background-color: #f3ba2f;"],
  ["bg-[#f3f4f6]", "background-color: #f3f4f6;"],
  ["bg-[#f4f4f4]", "background-color: #f4f4f4;"],
  ["bg-[#f5f5f5]", "background-color: #f5f5f5;"],
  ["bg-[#f6f7f8]", "background-color: #f6f7f8;"],
  ["bg-[#f9f9f9]", "background-color: #f9f9f9;"],
  ["bg-[#f9fafb]", "background-color: #f9fafb;"],
  ["bg-[#f8d7da]", "background-color: #f8d7da;"],
  ["bg-[#ff3b30]", "background-color: #ff3b30;"],
  ["bg-[rgb(242,241,246)]", "background-color: rgb(242,241,246);"],
  ["h-[60px]", "height: 60px;"],
  ["min-w-[220px]", "min-width: 220px;"],
  ["max-w-[600px]", "max-width: 600px;"],
  ["max-w-[680px]", "max-width: 680px;"],
  ["text-[#00457c]", "color: #00457c;"],
  ["text-[#0052FF]", "color: #0052FF;"],
  ["text-[#0070ba]", "color: #0070ba;"],
  ["text-[#007BFF]", "color: #007BFF;"],
  ["text-[#00B33C]", "color: #00B33C;"],
  ["text-[#00C774]", "color: #00C774;"],
  ["text-[#111827]", "color: #111827;"],
  ["text-[#181A20]", "color: #181A20;"],
  ["text-[#721c24]", "color: #721c24;"],
  ["text-[#1a0dab]", "color: #1a0dab;"],
  ["text-[#333]", "color: #333;"],
  ["text-[#3D95CE]", "color: #3D95CE;"],
  ["text-[#4b5563]", "color: #4b5563;"],
  ["text-[#555]", "color: #555;"],
  ["text-[#666]", "color: #666;"],
  ["text-[#6b7280]", "color: #6b7280;"],
  ["text-[#7f5bf6]", "color: #7f5bf6;"],
  ["text-[#9a6a1c]", "color: #9a6a1c;"],
  ["text-[#B8960C]", "color: #B8960C;"],
  ["text-[#D4AF37]", "color: #D4AF37;"],
  ["text-[#d9534f]", "color: #d9534f;"],
  ["text-[#f3ba2f]", "color: #f3ba2f;"],
  ["text-[10px]", "font-size: 10px;"],
  ["text-[11px]", "font-size: 11px;"],
  ["text-[12px]", "font-size: 12px;"],
  ["text-[22px]", "font-size: 22px;"],
  ["text-[28px]", "font-size: 28px;"],
  ["text-[32px]", "font-size: 32px;"],
  ["w-[60px]", "width: 60px;"],
].map(([className, declaration]) => utilityRule(className, declaration)).join("\n");

const emailCss = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: #f3f4f6; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; }
  table { border-collapse: collapse; }
  img { border: 0; display: block; outline: none; text-decoration: none; }
  button { font-family: Arial, Helvetica, sans-serif; }
  .font-sans { font-family: Arial, Helvetica, sans-serif; }
  .m-0 { margin: 0; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .ml-auto { margin-left: auto; }
  .my-2 { margin-top: 8px; margin-bottom: 8px; }
  .my-3 { margin-top: 12px; margin-bottom: 12px; }
  .my-4 { margin-top: 16px; margin-bottom: 16px; }
  .my-5 { margin-top: 20px; margin-bottom: 20px; }
  .my-6 { margin-top: 24px; margin-bottom: 24px; }
  .mt-1 { margin-top: 4px; }
  .mt-2 { margin-top: 8px; }
  .mt-3 { margin-top: 12px; }
  .mt-4 { margin-top: 16px; }
  .mt-5 { margin-top: 20px; }
  .mt-6 { margin-top: 24px; }
  .mt-8 { margin-top: 32px; }
  .mt-24 { margin-top: 96px; }
  .mb-1 { margin-bottom: 4px; }
  .mb-2 { margin-bottom: 8px; }
  .mb-3 { margin-bottom: 12px; }
  .mb-4 { margin-bottom: 16px; }
  .mb-5 { margin-bottom: 20px; }
  .mb-6 { margin-bottom: 24px; }
  .mb-7 { margin-bottom: 28px; }
  .mb-8 { margin-bottom: 32px; }
  .mb-9 { margin-bottom: 36px; }
  .mb-10 { margin-bottom: 40px; }
  .p-3 { padding: 12px; }
  .p-4 { padding: 16px; }
  .p-5 { padding: 20px; }
  .p-6 { padding: 24px; }
  .p-8 { padding: 32px; }
  .px-3 { padding-left: 12px; padding-right: 12px; }
  .px-4 { padding-left: 16px; padding-right: 16px; }
  .px-5 { padding-left: 20px; padding-right: 20px; }
  .px-6 { padding-left: 24px; padding-right: 24px; }
  .px-7 { padding-left: 28px; padding-right: 28px; }
  .px-8 { padding-left: 32px; padding-right: 32px; }
  .px-12 { padding-left: 48px; padding-right: 48px; }
  .py-2 { padding-top: 8px; padding-bottom: 8px; }
  .py-3 { padding-top: 12px; padding-bottom: 12px; }
  .py-4 { padding-top: 16px; padding-bottom: 16px; }
  .py-5 { padding-top: 20px; padding-bottom: 20px; }
  .py-6 { padding-top: 24px; padding-bottom: 24px; }
  .py-7 { padding-top: 28px; padding-bottom: 28px; }
  .py-12 { padding-top: 48px; padding-bottom: 48px; }
  .py-14 { padding-top: 56px; padding-bottom: 56px; }
  .pt-2 { padding-top: 8px; }
  .pt-3 { padding-top: 12px; }
  .pt-5 { padding-top: 20px; }
  .pb-4 { padding-bottom: 16px; }
  .pb-6 { padding-bottom: 24px; }
  .pb-8 { padding-bottom: 32px; }
  .flex { display: flex; }
  .inline-flex { display: inline-flex; }
  .grid { display: grid; }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .col-span-2 { grid-column: span 2 / span 2; }
  .items-center { align-items: center; }
  .items-start { align-items: flex-start; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .place-items-center { place-items: center; }
  .gap-2 { gap: 8px; }
  .gap-3 { gap: 12px; }
  .gap-5 { gap: 20px; }
  .gap-8 { gap: 32px; }
  .gap-y-2 { row-gap: 8px; }
  .gap-y-3 { row-gap: 12px; }
  .h-4 { height: 16px; }
  .h-7 { height: 28px; }
  .h-8 { height: 32px; }
  .h-20 { height: 80px; }
  .w-7 { width: 28px; }
  .w-8 { width: 32px; }
  .w-48 { width: 192px; }
  .w-72 { width: 288px; }
  .w-auto { width: auto; }
  .w-full { width: 100%; }
  .overflow-hidden { overflow: hidden; }
  .rounded { border-radius: 4px; }
  .rounded-md { border-radius: 6px; }
  .rounded-lg { border-radius: 8px; }
  .rounded-xl { border-radius: 12px; }
  .rounded-full { border-radius: 9999px; }
  .border { border-width: 1px; border-style: solid; }
  .border-2 { border-width: 2px; border-style: solid; }
  .border-t { border-top-width: 1px; border-top-style: solid; }
  .border-b { border-bottom-width: 1px; border-bottom-style: solid; }
  .border-y { border-top-width: 1px; border-bottom-width: 1px; border-top-style: solid; border-bottom-style: solid; }
  .border-collapse { border-collapse: collapse; }
  .border-white\/10 { border-color: rgba(255,255,255,0.1); }
  .bg-black { background-color: #000; }
  .bg-white { background-color: #fff; }
  .text-white { color: #fff; }
  .text-black { color: #000; }
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .text-xs { font-size: 12px; line-height: 16px; }
  .text-sm { font-size: 14px; line-height: 20px; }
  .text-base { font-size: 16px; line-height: 24px; }
  .text-lg { font-size: 18px; line-height: 28px; }
  .text-xl { font-size: 20px; line-height: 28px; }
  .text-2xl { font-size: 24px; line-height: 32px; }
  .text-3xl { font-size: 30px; line-height: 36px; }
  .text-4xl { font-size: 36px; line-height: 40px; }
  .text-5xl { font-size: 48px; line-height: 1; }
  .font-normal { font-weight: 400; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }
  .font-black { font-weight: 900; }
  .font-light { font-weight: 300; }
  .leading-4 { line-height: 16px; }
  .leading-5 { line-height: 20px; }
  .leading-6 { line-height: 24px; }
  .uppercase { text-transform: uppercase; }
  .lowercase { text-transform: lowercase; }
  .underline { text-decoration: underline; }
  .tracking-wide { letter-spacing: 0.025em; }
  .tracking-widest { letter-spacing: 0.1em; }
  .opacity-90 { opacity: 0.9; }
  .shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08); }
  .shadow-2xl { box-shadow: 0 25px 50px rgba(0,0,0,0.25); }
  .inline-block { display: inline-block; }
  ${escapedArbitraryCss}
  @media (max-width: 640px) {
    .sm\\:p-6 { padding: 24px; }
    .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .px-12 { padding-left: 24px; padding-right: 24px; }
    .py-14 { padding-top: 32px; padding-bottom: 32px; }
  }
`;

export function renderEmailHtml(data: EmailPreviewData) {
  const markup = renderToStaticMarkup(renderEmailTemplate(data));

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<style>${emailCss}</style>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;">
  ${markup}
</body>
</html>`;

  return juice(html, {
    preserveMediaQueries: true,
    removeStyleTags: false,
  });
}
