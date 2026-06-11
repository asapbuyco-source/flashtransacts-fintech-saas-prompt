import type { ReactElement, ReactNode } from "react";
import type { Notification } from "@/store/appStore";

export type EmailPreviewData = Partial<Notification> & {
  subject?: string;
  metadata?: Record<string, string>;
};

export type TemplateField = {
  key: string;
  label: string;
  type?: "text" | "email" | "date" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
};

type TemplateDefinition = {
  color: string;
  label: string;
  fields: TemplateField[];
  defaults: Record<string, string>;
  subject: (data: EmailPreviewData) => string;
  render: (data: EmailPreviewData) => ReactElement;
};

const today = new Date().toISOString().split("T")[0];

function value(data: EmailPreviewData, key: string, fallback = "") {
  const direct = data[key as keyof EmailPreviewData];
  const fromMeta = data.metadata?.[key];
  return String(direct || fromMeta || fallback);
}

function amount(data: EmailPreviewData, fallback = "750,000 CFA") {
  return value(data, "amount", fallback);
}

function warning(data: EmailPreviewData) {
  const text = value(data, "warningMessage") || value(data, "notes");
  if (!text) {
    return null;
  }

  const classes = "mb-5 rounded-md bg-[#ff3b30] px-4 py-3 text-center text-sm font-semibold text-white";

  return <div className={classes}>Warning: {text}</div>;
}

function Footer({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div style={{ backgroundColor: color }} className="px-6 py-5 text-center text-xs leading-5 text-white">
      {children}
    </div>
  );
}

function BrandedFormShell({ children }: { children: ReactNode; subject: string; to?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#f3f4f6] text-[#111827] shadow-2xl">
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function BinanceMark() {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "#f3ba2f",
        borderRadius: "6px",
        display: "inline-flex",
        height: "32px",
        justifyContent: "center",
        width: "32px",
      }}
    >
      <table role="presentation" cellPadding="0" cellSpacing="0" style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ fontSize: "8px", lineHeight: "8px", width: "9px" }}>&nbsp;</td>
            <td style={{ color: "#181A20", fontSize: "8px", fontWeight: 900, lineHeight: "8px", textAlign: "center", width: "9px" }}>◆</td>
            <td style={{ fontSize: "8px", lineHeight: "8px", width: "9px" }}>&nbsp;</td>
          </tr>
          <tr>
            <td style={{ color: "#181A20", fontSize: "8px", fontWeight: 900, lineHeight: "8px", textAlign: "center", width: "9px" }}>◆</td>
            <td style={{ color: "#181A20", fontSize: "7px", fontWeight: 900, lineHeight: "8px", textAlign: "center", width: "9px" }}>◆</td>
            <td style={{ color: "#181A20", fontSize: "8px", fontWeight: 900, lineHeight: "8px", textAlign: "center", width: "9px" }}>◆</td>
          </tr>
          <tr>
            <td style={{ fontSize: "8px", lineHeight: "8px", width: "9px" }}>&nbsp;</td>
            <td style={{ color: "#181A20", fontSize: "8px", fontWeight: 900, lineHeight: "8px", textAlign: "center", width: "9px" }}>◆</td>
            <td style={{ fontSize: "8px", lineHeight: "8px", width: "9px" }}>&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const sharedDepositFields: TemplateField[] = [
  { key: "amount", label: "Amount", placeholder: "750000", required: true },
  { key: "recipientEmail", label: "Receiver's Email", type: "email", placeholder: "receiver@example.com", required: true },
  { key: "senderEmail", label: "Sender's Email", type: "email", placeholder: "sender@example.com" },
  { key: "paymentNote", label: "Payment Note", placeholder: "Invoice payment" },
  { key: "warningMessage", label: "Optional Warning Message", type: "textarea", placeholder: "Enter a warning message" },
];

export const emailTemplates: Record<string, TemplateDefinition> = {
  Binance: {
    color: "#f3ba2f",
    label: "Binance",
    fields: [
      { key: "amount", label: "Amount", placeholder: "750000", required: true },
      { key: "currency", label: "Currency", placeholder: "CFA", required: true },
      {
        key: "coin",
        label: "Select Coin",
        type: "select",
        options: ["BTC", "ETH", "BNB", "TRX", "ADA", "XRP", "LTC", "BCH", "DOT", "MATIC", "SOL", "DOGE", "USDT"],
      },
      { key: "quantity", label: "Quantity of Coin", placeholder: "2.5", required: true },
      { key: "recipientEmail", label: "Receiver's Email", type: "email", placeholder: "receiver@example.com", required: true },
      { key: "senderEmail", label: "Sender's Email", type: "email", placeholder: "sender@example.com" },
      { key: "warningMessage", label: "Warning Message", type: "textarea", placeholder: "Enter a warning message" },
    ],
    defaults: { currency: "CFA", coin: "BTC", quantity: "2.5" },
    subject: () => `[Binance] Deposit Confirmed - ${new Date().toISOString().replace("T", " ").slice(0, 16)} (UTC)`,
    render: (data) => {
      const coin = value(data, "coin", "BTC");
      const quantity = value(data, "quantity", "2.5");
      const fiatAmount = amount(data);
      const transactionId = value(data, "transactionId", data.transactionId || "TXN-789012");

      return (
        <BrandedFormShell subject={emailTemplates.Binance.subject(data)} to={value(data, "recipientEmail", data.recipient)}>
          <div className="mx-auto max-w-[600px] overflow-hidden rounded-lg bg-[#f5f5f5] text-[#181A20] shadow">
            {warning(data)}
            <div className="bg-[#181A20] px-6 py-6 text-center">
              <div className="inline-flex items-center gap-3">
                <BinanceMark />
                <h1 className="m-0 text-xl font-bold text-[#f3ba2f]">BINANCE</h1>
              </div>
            </div>
            <div className="px-6 py-7 text-[#333]">
              <div className="mb-5 text-center">
                <div className="mx-auto mb-4 grid h-[60px] w-[60px] place-items-center rounded-full bg-[#f3ba2f] text-3xl font-bold text-black">✓</div>
                <h2 className="m-0 text-[28px] font-bold text-black">{coin} Deposit Successful</h2>
                <p className="mt-3 text-sm leading-5 text-[#666]">Deposit confirmed and available in your account.</p>
              </div>
              <p className="mb-5 text-base leading-6">
                Your deposit of {quantity} {coin} is now available in your Binance account. Log in to check your balance.
              </p>
              <div className="mb-6 rounded-lg border border-[#e5e7eb] bg-white p-5">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-[#666]">Asset</span><strong className="text-right">{coin}</strong>
                  <span className="text-[#666]">Quantity</span><strong className="text-right">{quantity} {coin}</strong>
                  <span className="text-[#666]">Estimated value</span><strong className="text-right text-[#181A20]">{fiatAmount}</strong>
                  <span className="text-[#666]">Status</span><strong className="text-right text-[#00B33C]">Completed</strong>
                  <span className="text-[#666]">Transaction ID</span><strong className="text-right">{transactionId}</strong>
                </div>
              </div>
              <button type="button" className="mb-5 w-full rounded bg-[#f3ba2f] px-6 py-3 font-bold text-black">View Deposit Details</button>
              <p className="text-sm leading-6">Do not recognize this activity? Please reset your password and contact customer support immediately.</p>
              <p className="mt-4 text-sm text-[#d9534f]">This is an automated message, please do not reply.</p>
            </div>
            <div className="bg-[#f9f9f9] px-6 py-5 text-left text-xs leading-5 text-[#666]">
              <p className="text-center font-bold text-[#f3ba2f]">Stay connected!</p>
              <div className="mb-4 flex justify-center gap-3">
                {["f", "x", "ig", "in", "▶"].map((item) => (
                  <span key={item} className="grid h-8 w-8 place-items-center rounded-full bg-white text-[10px] font-bold text-[#f3ba2f] shadow">
                    {item}
                  </span>
                ))}
              </div>
              <p>Risk warning: Digital asset prices can be volatile. You are solely responsible for your investment decisions.</p>
              <p className="text-center">© 2024 Binance.com, All Rights Reserved.</p>
            </div>
          </div>
        </BrandedFormShell>
      );
    },
  },
  "Apple Pay": {
    color: "#0071e3",
    label: "Apple Pay",
    fields: [
      { key: "recipientName", label: "Client Name", placeholder: "Clients" },
      { key: "amount", label: "Amount", placeholder: "29.88", required: true },
      { key: "currency", label: "Currency", placeholder: "USD", required: true },
      { key: "merchantName", label: "Merchant", placeholder: "cleverbirdge, Inc" },
      { key: "merchantEmail", label: "Merchant Email", type: "email", placeholder: "payment@apple.com" },
      { key: "itemDescription", label: "Description", placeholder: "Email Itunes GiftCard" },
      { key: "itemCode", label: "Item Code", placeholder: "#96782658" },
      { key: "quantity", label: "Qty", placeholder: "1" },
      { key: "transactionId", label: "Transaction ID", placeholder: "965A578180L053022U" },
      { key: "invoiceId", label: "Invoice ID", placeholder: "2950320884" },
      { key: "instructions", label: "Instructions to merchant", placeholder: "You haven't entered any instructions." },
      { key: "recipientEmail", label: "Apple Pay Email", type: "email", placeholder: "payment@apple.com", required: true },
      { key: "warningMessage", label: "Optional Warning Message", type: "textarea" },
    ],
    defaults: {
      recipientName: "Clients",
      amount: "29.88 USD",
      currency: "USD",
      merchantName: "cleverbirdge, Inc",
      merchantEmail: "payment@apple.com",
      itemDescription: "Email Itunes GiftCard",
      itemCode: "#96782658",
      quantity: "1",
      transactionId: "965A578180L053022U",
      invoiceId: "2950320884",
      instructions: "You haven't entered any instructions.",
    },
    subject: (data) => `Apple Pay Receipt: ${amount(data)}`,
    render: (data) => (
      <BrandedFormShell subject={emailTemplates["Apple Pay"].subject(data)} to={value(data, "recipientEmail", data.recipient)}>
        <div className="mx-auto max-w-[680px] border-[14px] border-[#4b4d50] bg-white px-12 py-14 font-sans text-[12px] leading-4 text-black shadow">
          {warning(data)}
          <div className="mb-9 flex items-start justify-between">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Apple Logo"
              className="h-20 w-auto"
            />
            <div className="pt-3 text-right text-[10px]">
              Transaction ID:{" "}
              <span className="font-semibold text-[#1a0dab] underline">
                {value(data, "transactionId", data.transactionId || "965A578180L053022U")}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-bold">Hello {value(data, "recipientName", data.recipientName || "Clients")},</p>
            <p className="font-bold text-[#9a6a1c]">
              You sent a payment of {amount(data, "29.88 USD")} to Apple, Inc
            </p>
            <p>
              <span className="font-bold text-[#1a0dab] underline">{value(data, "recipientEmail", "payment@apple.com")}</span>
            </p>
          </div>

          <p className="mb-2">It may take a few moments for this transaction to appear in your account.</p>

          <div className="mb-10 grid grid-cols-2 gap-8 border-t border-[#c7c7c7] pt-2">
            <div>
              <p className="font-bold">Merchant</p>
              <p>{value(data, "merchantName", "cleverbirdge, Inc")}</p>
              <p className="font-semibold text-[#1a0dab] underline">{value(data, "merchantEmail", "payment@apple.com")}</p>
            </div>
            <div>
              <p className="font-bold">Instructions to merchant</p>
              <p className="font-bold">Creditcard</p>
              <p>{value(data, "instructions", "You haven't entered any instructions.")}</p>
            </div>
          </div>

          <table className="mb-4 w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-y border-[#c7c7c7] text-left">
                <th className="py-2 font-normal">Description</th>
                <th className="py-2 text-right font-normal">Unit Price</th>
                <th className="py-2 text-right font-normal">Qty</th>
                <th className="py-2 text-right font-normal">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#d7d7d7]">
                <td className="py-3">
                  {value(data, "itemDescription", "Email Itunes GiftCard")} -{" "}
                  <span className="font-semibold text-[#1a0dab] underline">{value(data, "itemCode", "#96782658")}</span>
                </td>
                <td className="py-3 text-right">{amount(data, "29.88 USD")}</td>
                <td className="py-3 text-right">{value(data, "quantity", "1")}</td>
                <td className="py-3 text-right">{amount(data, "29.88 USD")}</td>
              </tr>
            </tbody>
          </table>

          <div className="mb-7 ml-auto w-48 text-[11px]">
            <div className="grid grid-cols-2 gap-y-2">
              <span className="font-bold">Subtotal</span>
              <span className="text-right">{amount(data, "29.88 USD")}</span>
              <span className="font-bold">Total</span>
              <span className="text-right">{amount(data, "29.88 USD")}</span>
              <span className="col-span-2 h-4" />
              <span className="font-bold">Payment</span>
              <span className="text-right">{amount(data, "29.88 USD")}</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="font-bold">Invoice ID: {value(data, "invoiceId", "2950320884")}</p>
            <p className="font-bold">Issues with this transaction?</p>
            <p className="mt-4 text-[10px] font-bold">
              If this not your transaction, press the button below. We will help the process of recovery refund and protect your account.
            </p>
            <button type="button" className="mt-4 w-72 bg-[#10a8df] py-3 text-center text-[12px] font-bold text-white">
              Dispute Transaction
            </button>
          </div>

          <div className="mt-24 border-t border-[#d7d7d7] pt-5 text-[10px] leading-4">
            <p>Copyright © 2017 Apple Inc. All rights reserved.</p>
            <p className="mt-3">
              Consumer advisory: Apple Pte Ltd, the Holder of the Apple? payment stored value facility, does not require the approval
              of the Monetary Authority of California. Consumers (users) are advised to read the terms and conditions carefully.
            </p>
            <div className="mt-5 flex justify-center gap-3 border-t border-[#e1e1e1] pt-3">
              <button type="button" className="rounded border border-[#777] px-5 py-2 text-[12px]">Buy with  Pay</button>
              <button type="button" className="rounded border border-[#777] px-7 py-2 text-[12px]"> Pay</button>
            </div>
          </div>
        </div>
      </BrandedFormShell>
    ),
  },
  "Cash App": {
    color: "#00C774",
    label: "Cash App",
    fields: [
      { key: "amount", label: "Amount", placeholder: "750000", required: true },
      { key: "senderHandle", label: "Sender's Cash App Username", placeholder: "$sender" },
      { key: "receiverHandle", label: "Receiver's Cash App Username", placeholder: "$receiver" },
      ...sharedDepositFields.slice(1),
    ],
    defaults: { senderHandle: "$sender", receiverHandle: "$receiver", paymentNote: "Payment received" },
    subject: (data) => `Deposit Confirmation: ${amount(data)} via Cash App`,
    render: (data) => (
      <BrandedFormShell subject={emailTemplates["Cash App"].subject(data)} to={value(data, "recipientEmail", data.recipient)}>
        <div className="mx-auto max-w-[600px] bg-white text-[#333]">
          {warning(data)}
          <div className="bg-[#00C774] px-6 py-12 text-center text-white">
            <h1 className="text-4xl font-bold">Cash App</h1>
          </div>
          <div className="px-6 py-6">
            <h2 className="mb-4 text-xl font-bold">Your Cash App deposit has been successfully processed!</h2>
            <p><strong>Dear Client ({value(data, "senderHandle", "$sender")}),</strong></p>
            <p className="mt-4">Thank you for using <strong className="text-[#00C774]">Cash App</strong> as an online payment.</p>
            <p className="mt-4">The sum of <strong className="text-[#00C774]">{amount(data)}</strong> has been paid to your Cash App account by {value(data, "receiverHandle", "$receiver")}.</p>
            <p className="mt-4">In our effort to protect all merchants' transactions, we have now received payment for your item from our secure server. This helps ensure both seller and buyer complete their responsibilities in every transaction we handle.</p>
            <p className="mt-4">Payment note: {value(data, "paymentNote", "Payment received")}</p>
          </div>
          <Footer color="#00C774">
            <p>Need help? Visit our Support Center or Contact Us.</p>
            <p>© 2024 Cash App, All Rights Reserved.</p>
          </Footer>
        </div>
      </BrandedFormShell>
    ),
  },
  Venmo: {
    color: "#3D95CE",
    label: "Venmo",
    fields: [
      { key: "amount", label: "Amount", placeholder: "750000", required: true },
      { key: "senderHandle", label: "Sender's Venmo Username", placeholder: "@sender" },
      { key: "receiverHandle", label: "Receiver's Venmo Username", placeholder: "@receiver" },
      ...sharedDepositFields.slice(1),
    ],
    defaults: { senderHandle: "@sender", receiverHandle: "@receiver", paymentNote: "Invoice payment" },
    subject: (data) => `Deposit Confirmation: ${amount(data)} via Venmo`,
    render: (data) => (
      <BrandedFormShell subject={emailTemplates.Venmo.subject(data)} to={value(data, "recipientEmail", data.recipient)}>
        <table className="mx-auto w-full max-w-[600px] overflow-hidden rounded-lg border border-[#ddd] bg-white text-[#333]">
          <thead className="bg-[#3D95CE] text-center text-white">
            <tr><th className="p-5 text-2xl">Venmo</th></tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-6">
                {warning(data)}
                <h2 className="text-xl font-bold text-[#3D95CE]">CoWork Greenville paid {value(data, "receiverHandle", "@receiver")}</h2>
                <p className="text-[#555]">For: {value(data, "paymentNote", "Invoice payment")}</p>
                <p className="text-lg font-bold text-[#3D95CE]">+ {amount(data)}</p>
                <p className="mt-5 text-[#555]">Transaction Date: {today}</p>
                <p className="text-[#555]">Payment ID: <span className="text-[#333]">{value(data, "transactionId", "123456789123456789")}</span></p>
                <div className="mt-5 flex gap-3">
                  <button type="button" className="rounded bg-[#3D95CE] px-5 py-2 text-white">Like</button>
                  <button type="button" className="rounded bg-[#3D95CE] px-5 py-2 text-white">Comment</button>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot className="bg-[#f5f5f5] text-center text-[#555]">
            <tr><td className="p-5 text-sm">
              <p>Money credited to your Venmo balance. <strong>Cash out</strong> to your bank overnight.</p>
              <button type="button" className="my-4 rounded bg-[#3D95CE] px-8 py-3 font-bold text-white">Invite Friends!</button>
              <hr className="my-4 border-[#ddd]" />
              <p className="text-xs">Venmo is a service of PayPal, Inc., a licensed provider of money transfer services.</p>
              <p className="text-xs">PayPal is located at 2211 North First Street, San Jose, CA 95131.</p>
              <p className="text-xs">© 2024 Venmo, All Rights Reserved.</p>
            </td></tr>
          </tfoot>
        </table>
      </BrandedFormShell>
    ),
  },
  Interac: {
    color: "#f7b801",
    label: "e-Transfer",
    fields: [
      { key: "recipientName", label: "Recipient Name", placeholder: "Customer" },
      { key: "senderName", label: "Sender's Name", placeholder: "Bennett James" },
      { key: "amount", label: "Amount", placeholder: "$895.00 (CAD)", required: true },
      { key: "currency", label: "Currency", placeholder: "CAD" },
      { key: "senderEmail", label: "Sender's Email", type: "email", placeholder: "sender@example.com" },
      { key: "recipientEmail", label: "Receiver's Email", type: "email", placeholder: "receiver@example.com", required: true },
      { key: "transactionId", label: "Reference Number", placeholder: "C1a9E19K7Y2t" },
      { key: "financialInstitution", label: "Financial Institution", placeholder: "TD Canada Trust" },
      { key: "paymentNote", label: "Footer Note", type: "textarea", placeholder: "Transfer notice footer text" },
    ],
    defaults: {
      currency: "CAD",
      financialInstitution: "your financial institution",
      paymentNote: "Email or text messages carry the notice while financial institutions securely transfer the money using existing payment networks.",
      recipientName: "Customer",
      senderName: "Bennett James",
    },
    subject: (data) => `e-Transfer Deposit: ${amount(data)}`,
    render: (data) => {
      const recipientName = value(data, "recipientName", data.recipientName || "Customer");
      const senderName = value(data, "senderName", "Bennett James");
      const referenceNumber = value(data, "transactionId", data.reference || "C1a9E19K7Y2t");
      const institution = value(data, "financialInstitution", "your financial institution");
      const footerNote = value(
        data,
        "paymentNote",
        "Email or text messages carry the notice while financial institutions securely transfer the money using existing payment networks."
      );

      return (
        <BrandedFormShell subject={emailTemplates.Interac.subject(data)} to={value(data, "recipientEmail", data.recipient)}>
        <div style={{ backgroundColor: "#f2f2f2", color: "#202124", fontFamily: "Arial, Helvetica, sans-serif", margin: "0 auto", maxWidth: "600px", padding: "18px 14px" }}>
          {warning(data)}
          <div style={{ backgroundColor: "#202020", padding: "12px 18px" }}><table role="presentation" cellPadding="0" cellSpacing="0" width="100%"><tbody><tr><td align="left" style={{ width: "120px" }}><span style={{ backgroundColor: "#ffc629", borderRadius: "7px", color: "#1b1b1b", display: "inline-block", fontSize: "18px", fontWeight: 800, lineHeight: "20px", padding: "9px 10px" }}>e-T</span></td><td align="right" style={{ color: "#f4f4f4", fontSize: "16px", lineHeight: "22px" }}>View in browser&nbsp;&nbsp;|&nbsp;&nbsp;Francais&nbsp;&nbsp;?</td></tr></tbody></table></div>
          <div style={{ backgroundColor: "#ffffff", padding: "42px 18px 26px" }}>
            <h1 style={{ color: "#111111", fontSize: "32px", fontWeight: 700, lineHeight: "40px", margin: "0 0 48px" }}>Hi {recipientName},</h1>
            <p style={{ color: "#222222", fontSize: "24px", lineHeight: "34px", margin: "0 0 34px" }}><strong style={{ fontWeight: 400, textTransform: "uppercase" }}>{senderName}</strong> has sent you <strong style={{ fontWeight: 400 }}>{amount(data)}</strong> and the money has been automatically deposited into your bank account.</p>
            <p style={{ color: "#222222", fontSize: "24px", lineHeight: "32px", margin: "0 0 20px" }}>Reference Number: {referenceNumber}</p>
            <p style={{ color: "#222222", fontSize: "24px", lineHeight: "32px", margin: "0" }}>Please do not reply to this email.</p>
          </div>
          <div style={{ backgroundColor: "#ffffff", color: "#777777", fontSize: "20px", lineHeight: "28px", padding: "28px 18px 14px", textAlign: "center" }}>FAQs&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;This is a secure transaction</div>
          <div style={{ backgroundColor: "#ffffff", padding: "18px 18px 0" }}><table role="presentation" cellPadding="0" cellSpacing="0" width="100%"><tbody><tr><td align="left" style={{ verticalAlign: "top", width: "120px" }}><span style={{ backgroundColor: "#ffc629", borderRadius: "7px", color: "#1b1b1b", display: "inline-block", fontSize: "18px", fontWeight: 800, lineHeight: "20px", padding: "9px 10px" }}>e-T</span></td><td align="right" style={{ color: "#a5a5a5", fontSize: "16px", lineHeight: "24px" }}>Copyright 2024 Transfer Notice.<br />All rights reserved. Terms of Use</td></tr></tbody></table></div>
          <div style={{ backgroundColor: "#ffffff", padding: "46px 18px 18px", textAlign: "center" }}>{["x", "f", "in", "yt"].map((item) => (<span key={item} style={{ backgroundColor: "#888888", borderRadius: "999px", color: "#ffffff", display: "inline-block", fontSize: "15px", fontWeight: 700, height: "38px", lineHeight: "38px", margin: "0 7px", textAlign: "center", width: "38px" }}>{item}</span>))}</div>
          <div style={{ backgroundColor: "#ffffff", color: "#b2b2b2", fontSize: "19px", lineHeight: "30px", padding: "22px 18px 28px" }}><p style={{ margin: "0 0 34px" }}>{footerNote}</p><p style={{ margin: "0" }}>This message was generated for a transfer record on behalf of {senderName} at {institution}. Verify deposits in your banking app before taking action.</p></div>
        </div>
      </BrandedFormShell>
      );
    },
  },
  Zelle: {
    color: "#7f5bf6",
    label: "Zelle",
    fields: [
      { key: "amount", label: "Amount", placeholder: "750000", required: true },
      { key: "recipientEmail", label: "Receiver's Email", type: "email", placeholder: "receiver@example.com", required: true },
      { key: "senderName", label: "Sender's Name", placeholder: "John Smith" },
      { key: "senderEmail", label: "Sender's Email", type: "email", placeholder: "sender@example.com" },
      { key: "warningMessage", label: "Optional Warning Message", placeholder: "Enter a warning message" },
    ],
    defaults: { senderName: "John Smith" },
    subject: () => "You received money via Zelle!",
    render: (data) => (
      <BrandedFormShell subject={emailTemplates.Zelle.subject(data)} to={value(data, "recipientEmail", data.recipient)}>
        <div className="mx-auto max-w-[600px] bg-white px-6 py-7 text-center text-[#333]">
          <div className="mb-5 text-3xl font-bold uppercase text-[#7f5bf6]"><span className="text-4xl">Z</span>elle<sup>®</sup></div>
          <p className="text-lg"><strong>{value(data, "senderName", "John Smith")}</strong> sent you</p>
          <p className="my-3 text-5xl font-bold">{amount(data)}</p>
          {warning(data)}
          <button type="button" className="my-4 min-w-[220px] rounded bg-[#7f5bf6] px-6 py-4 text-lg font-bold text-white">Accept Money</button>
          <p className="mt-4 text-sm text-[#666]">Zelle® is a fast, safe & easy way to send money to and receive money from friends, family, and others you trust.</p>
          <div className="mt-8 bg-[#f4f4f4] p-5 text-sm text-[#7f5bf6]">Zelle® · Contact · Privacy · Legal</div>
        </div>
      </BrandedFormShell>
    ),
  },
  Chime: {
    color: "#00B33C",
    label: "Chime",
    fields: [
      { key: "amount", label: "Amount Received", placeholder: "750000", required: true },
      { key: "senderName", label: "Sender's Name", placeholder: "John Smith" },
      { key: "recipientEmail", label: "Receiver's Email", type: "email", placeholder: "receiver@example.com", required: true },
      { key: "paymentNote", label: "Payment Note (Optional)", placeholder: "Deposit" },
      { key: "warningMessage", label: "Optional Warning Message", type: "textarea" },
    ],
    defaults: { senderName: "John Smith", paymentNote: "Deposit" },
    subject: () => "Your deposit is now available",
    render: (data) => (
      <BrandedFormShell subject={emailTemplates.Chime.subject(data)} to={value(data, "recipientEmail", data.recipient)}>
        <div className="mx-auto max-w-[600px] bg-[rgb(242,241,246)] py-4 text-[#333]">
          {warning(data)}
          <table className="mx-auto w-full max-w-[600px] rounded-lg bg-white">
            <thead><tr><th className="p-5 text-center text-[32px] font-semibold lowercase tracking-wide text-[#00B33C]">chime<sup className="text-[10px]">®</sup></th></tr></thead>
            <tbody><tr><td className="px-6 pb-6 text-left">
              <p>Hi,</p>
              <p>A deposit of <strong>{amount(data)}</strong> has been successfully posted to your Chime Checking Account.</p>
              <p>Your updated balance is now available to use.</p>
              <p>This deposit was sent by <strong>{value(data, "senderName", "John Smith")}</strong> and is securely processed by Chime.</p>
              <p>To view your transaction details, log in to your <span className="font-bold text-[#00B33C]">Chime account</span>.</p>
              <p>Cheers,<br />The Chime Team</p>
            </td></tr></tbody>
          </table>
          <div className="px-6 py-5 text-center text-xs leading-5 text-[#555]">©2024 <span className="font-bold text-[#00B33C]">Chime®</span>. Banking services are provided by partner banks, Members FDIC.</div>
        </div>
      </BrandedFormShell>
    ),
  },
  PayPal: {
    color: "#0070ba",
    label: "PayPal",
    fields: [
      { key: "recipientName", label: "Recipient's Name", placeholder: "Jane Smith" },
      { key: "recipientEmail", label: "Recipient's Email", type: "email", placeholder: "recipient@example.com", required: true },
      { key: "senderName", label: "Sender's Name", placeholder: "John Smith" },
      { key: "amount", label: "Amount", placeholder: "750000", required: true },
      { key: "transactionDate", label: "Transaction Date", type: "date" },
      { key: "transactionId", label: "Transaction ID", placeholder: "TXN-789012" },
      { key: "dispatchAddress", label: "Dispatch Address", type: "textarea", placeholder: "123 Market Street" },
      { key: "addressStatus", label: "Address Status", placeholder: "Confirmed" },
      { key: "warningMessage", label: "Optional Warning Message", type: "textarea" },
    ],
    defaults: { recipientName: "Jane Smith", senderName: "John Smith", transactionDate: today, addressStatus: "Confirmed", dispatchAddress: "123 Market Street" },
    subject: () => "PayPal Receipt: Payment Details",
    render: (data) => (
      <BrandedFormShell subject={emailTemplates.PayPal.subject(data)} to={value(data, "recipientEmail", data.recipient)}>
        <div className="mx-auto max-w-[600px] border border-[#ccc] bg-[#f6f7f8] p-5 text-[#333]">
          {warning(data)}
          <div className="bg-[#0070ba] px-6 py-5 text-center text-3xl font-bold text-white">Pay<span className="text-[#00457c]">Pal</span></div>
          <div className="py-5 text-center text-xl font-bold text-[#0070ba]">Thank you for using PayPal as your method of payment.</div>
          <p><strong>Dear {value(data, "recipientName", data.recipientName || "Jane Smith")},</strong></p>
          <p>{value(data, "senderName", "John Smith")} just sent you money with PayPal.</p>
          <div className="my-5 grid gap-5 border-t border-[#ddd] pt-5 sm:grid-cols-2">
            <div>
              <h3 className="font-bold">Reversals:</h3>
              <p className="text-sm leading-5">Please be aware that your payment can still be reversed, for example if it is subject to a chargeback, even after you have posted the item to your buyer. Following the PayPal Seller Protection guidelines and the trading guidelines on our Security page helps protect you from chargebacks.</p>
            </div>
            <div>
              <h3 className="font-bold">Dispatch Information:</h3>
              <p className="text-sm leading-5">Address:<br />{value(data, "dispatchAddress", "123 Market Street")}</p>
              <p className="text-sm">Address status: {value(data, "addressStatus", "Confirmed")}</p>
            </div>
          </div>
          <div className="border-t border-[#ddd] pt-5">
            <h3 className="font-bold">Payment Details:</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span>Amount:</span><strong>{amount(data)}</strong>
              <span>Transaction Date:</span><strong>{value(data, "transactionDate", today)}</strong>
              <span>Transaction ID:</span><strong>{value(data, "transactionId", data.transactionId || "TXN-789012")}</strong>
            </div>
          </div>
          <div className="mt-6 border-t border-[#ccc] pt-5 text-center text-xs leading-5 text-[#666]">Privacy | Security | Contact Us<br />PayPal, Inc. © 2025 All rights reserved.</div>
        </div>
      </BrandedFormShell>
    ),
  },
  Coinbase: {
    color: "#0052FF",
    label: "Coinbase",
    fields: [
      { key: "cryptoType", label: "Cryptocurrency", type: "select", options: ["BTC", "ETH", "USDT", "LTC", "DOGE", "XRP"] },
      { key: "cryptoAmount", label: "Amount Received", placeholder: "2.5" },
      { key: "usdValue", label: "CFA Equivalent", placeholder: "750000" },
      { key: "senderName", label: "Sender's Name", placeholder: "John Smith" },
      { key: "recipientEmail", label: "Receiver's Email", type: "email", placeholder: "receiver@example.com", required: true },
      { key: "warningMessage", label: "Optional Warning Message", type: "textarea" },
    ],
    defaults: { cryptoType: "BTC", cryptoAmount: "2.5", usdValue: "750,000 CFA", senderName: "John Smith" },
    subject: (data) => `${value(data, "senderName", "John Smith")} just sent you ${value(data, "cryptoAmount", "2.5")} ${value(data, "cryptoType", "BTC")}`,
    render: (data) => {
      const cryptoType = value(data, "cryptoType", "BTC");
      const cryptoAmount = value(data, "cryptoAmount", "2.5");
      const fiat = value(data, "usdValue", amount(data));
      return (
        <BrandedFormShell subject={emailTemplates.Coinbase.subject(data)} to={value(data, "recipientEmail", data.recipient)}>
          <div className="mx-auto max-w-[600px] bg-[#0052FF] p-5 text-white">
            {warning(data)}
            <table className="w-full overflow-hidden rounded-lg bg-white text-[#333] shadow">
              <thead className="bg-[#0052FF] text-center text-white"><tr><th className="p-5 text-[28px] font-semibold lowercase">coinbase</th></tr></thead>
              <tbody>
                <tr><td className="p-8 text-center">
                  <div className="mx-auto grid h-[60px] w-[60px] place-items-center rounded-full border-2 border-[#0052FF] text-3xl text-[#0052FF]">✓</div>
                  <h2 className="mt-5 text-2xl font-bold">You just received</h2>
                  <p className="text-xl font-bold">{cryptoAmount} {cryptoType} ({fiat})</p>
                </td></tr>
                <tr><td className="px-8 pb-6 text-left">
                  <p><strong>{value(data, "senderName", "John Smith")}</strong> just sent you <strong>{cryptoAmount} {cryptoType}</strong>.</p>
                  <p>Your transferred currency is available immediately, and you can view transaction details in your Coinbase account.</p>
                </td></tr>
                <tr><td className="pb-8 text-center"><button type="button" className="rounded bg-[#0052FF] px-6 py-3 font-bold text-white">View this transaction</button></td></tr>
              </tbody>
            </table>
            <div className="px-4 py-5 text-center text-xs leading-5">©2024 Coinbase. All rights reserved.<br />For support, visit our Help Center.</div>
          </div>
        </BrandedFormShell>
      );
    },
  },
  Custom: {
    color: "#D4AF37",
    label: "FlashTransacts",
    fields: [
      { key: "recipientName", label: "Recipient Name", placeholder: "Jane Smith" },
      { key: "recipientEmail", label: "Recipient Email", type: "email", placeholder: "recipient@example.com", required: true },
      { key: "amount", label: "Amount", placeholder: "750000", required: true },
      { key: "transactionId", label: "Transaction ID", placeholder: "TXN-789012" },
      { key: "paymentNote", label: "Description", type: "textarea", placeholder: "Transaction description" },
      { key: "warningMessage", label: "Optional Warning Message", type: "textarea" },
    ],
    defaults: { recipientName: "Jane Smith", paymentNote: "Transaction notification" },
    subject: (data) => `${data.type || "Transaction Notice"} - ${amount(data)}`,
    render: (data) => (
      <BrandedFormShell subject={emailTemplates.Custom.subject(data)} to={value(data, "recipientEmail", data.recipient)}>
        <div className="mx-auto max-w-[600px] overflow-hidden rounded-lg bg-white text-[#111827]">
          <div className="bg-[#050505] px-6 py-5 text-white">
            <div className="text-xl font-bold">Flash<span className="text-[#D4AF37]">Transacts</span></div>
          </div>
          <div className="px-6 py-7">
            {warning(data)}
            <p className="text-sm text-[#6b7280]">Hello {value(data, "recipientName", data.recipientName || "Customer")},</p>
            <h2 className="mt-2 text-2xl font-bold">{data.type || "Transaction Notice"}</h2>
            <p className="mt-3 text-sm leading-6 text-[#4b5563]">{value(data, "paymentNote", data.description || "Transaction notification")}</p>
            <div className="my-6 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4">
              <div className="text-xs uppercase tracking-widest text-[#6b7280]">Amount</div>
              <div className="text-3xl font-bold text-[#B8960C]">{amount(data)}</div>
              <div className="mt-3 text-sm text-[#4b5563]">Transaction ID: {value(data, "transactionId", data.transactionId || "TXN-789012")}</div>
            </div>
            <button type="button" className="w-full rounded bg-[#D4AF37] px-5 py-3 font-bold text-black">View Details</button>
          </div>
        </div>
      </BrandedFormShell>
    ),
  },
};

export const getEmailTemplate = (brand = "Custom") => emailTemplates[brand] || emailTemplates.Custom;

export function getTemplateDefaults(brand: string) {
  return getEmailTemplate(brand).defaults;
}

export function getTemplateFields(brand: string) {
  return getEmailTemplate(brand).fields;
}

export function getEmailSubject(data: EmailPreviewData) {
  return getEmailTemplate(data.brand).subject(data);
}

export function renderEmailTemplate(data: EmailPreviewData) {
  return getEmailTemplate(data.brand).render(data);
}

