export const features = [
  {
    icon: "Mail",
    title: "Email Delivery",
    description: "Send styled HTML payment notifications through your verified domain with saved logs and status feedback.",
  },
  {
    icon: "BarChart3",
    title: "Delivery Logs",
    description: "Review send attempts, failed messages, recipients, templates, and manual activity from Firestore-backed records.",
  },
  {
    icon: "LayoutTemplate",
    title: "Live Templates",
    description: "Edit payment details, currencies, transaction IDs, notes, and recipients while watching the preview update.",
  },
  {
    icon: "Bell",
    title: "Notifications",
    description: "Create wallet, banking, crypto, and custom notification workflows from one clear sending screen.",
  },
  {
    icon: "Users",
    title: "User Management",
    description: "Manage role-based access, manual subscription requests, approval status, and user lifecycle controls.",
  },
  {
    icon: "Shield",
    title: "Admin Controls",
    description: "Set the WhatsApp contact number, activate plans manually, protect free-plan sending, and configure platform settings.",
  },
];

export const modules = [
  { name: "PayPal", description: "Configurable wallet receipt layout for authorized payment notifications.", color: "#003087" },
  { name: "Apple Pay", description: "Minimal invoice-style layout for card and wallet payment receipts.", color: "#000000" },
  { name: "Venmo", description: "Compact person-to-person transfer notice with editable note fields.", color: "#008CFF" },
  { name: "Cash App", description: "Bold wallet notification layout with amount, sender, and status controls.", color: "#00D632" },
  { name: "Zelle", description: "Bank-transfer notification layout with recipient and confirmation details.", color: "#6C1D45" },
  { name: "Chime", description: "Clean banking alert layout for deposits, transfers, and balance updates.", color: "#1CAAD9" },
  { name: "Interac", description: "e-Transfer notification layout with sender, message, and deposit details.", color: "#FF6B00" },
  { name: "Coinbase", description: "Crypto transaction layout for asset, network, and estimated value fields.", color: "#0052FF" },
  { name: "Binance", description: "Exchange notification layout with asset, quantity, value, and status fields.", color: "#F0B90B" },
  { name: "Custom", description: "A flexible branded layout for your own notification use cases.", color: "#D4AF37" },
];

export const testimonials = [
  {
    name: "Marcus Chen",
    role: "CTO, FinFlow Inc",
    content: "FlashTransacts transformed how we handle transaction notifications. The delivery rates are exceptional and the analytics are invaluable.",
    avatar: "MC",
  },
  {
    name: "Sarah Williams",
    role: "Product Manager, PayBridge",
    content: "The template system is incredibly powerful. We went from hours of design work to generating beautiful notifications in minutes.",
    avatar: "SW",
  },
  {
    name: "David Park",
    role: "Founder, CryptoNotify",
    content: "Best-in-class notification platform. The multi-provider support and real-time tracking give us complete visibility.",
    avatar: "DP",
  },
  {
    name: "Elena Rodriguez",
    role: "VP Engineering, BankTech",
    content: "Enterprise-grade security with beautiful design. FlashTransacts is the gold standard for transaction notifications.",
    avatar: "ER",
  },
];

export const pricingPlans = [
  {
    name: "Trial",
    price: "0 CFA",
    period: "7 days",
    description: "Full access for 7 days",
    features: [
      "100 notifications",
      "3 templates",
      "Basic analytics",
      "Email support",
      "Standard delivery",
    ],
    highlighted: false,
  },
  {
    name: "Monthly",
    price: "60,000 CFA",
    period: "/month",
    description: "Perfect for growing businesses",
    features: [
      "5,000 notifications",
      "Unlimited templates",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
    ],
    highlighted: true,
  },
  {
    name: "Quarterly",
    price: "150,000 CFA",
    period: "/quarter",
    description: "Save 16% with quarterly billing",
    features: [
      "20,000 notifications",
      "Unlimited templates",
      "Premium analytics",
      "24/7 support",
      "White-label option",
      "API access",
      "Team collaboration",
    ],
    highlighted: false,
  },
  {
    name: "Yearly",
    price: "480,000 CFA",
    period: "/year",
    description: "Best value - save 33%",
    features: [
      "100,000 notifications",
      "Everything in Quarterly",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Priority queue",
    ],
    highlighted: false,
  },
  {
    name: "Lifetime",
    price: "1,500,000 CFA",
    period: "one-time",
    description: "Pay once, use forever",
    features: [
      "Unlimited notifications",
      "All features included",
      "Lifetime updates",
      "VIP support",
      "Custom development",
      "Enterprise SLA",
    ],
    highlighted: false,
  },
];

export const faqs = [
  {
    question: "How does account creation work?",
    answer: "Accounts are created immediately. To activate server access, choose a plan and contact the admin on WhatsApp for manual subscription activation.",
  },
  {
    question: "Can I use my own email templates?",
    answer: "Yes! FlashTransacts supports custom HTML templates alongside our pre-built templates. You can also modify existing templates using our visual builder.",
  },
  {
    question: "What delivery rates can I expect?",
    answer: "The dashboard provides delivery attempts, status feedback, and saved logs so admins can review every notification run. Inbox placement still depends on sender authentication, domain reputation, and message quality.",
  },
  {
    question: "Is my data secure?",
    answer: "FlashTransacts uses Firebase authentication, Firestore-backed records, protected routes, and role-based admin access. Production deployments should keep secrets server-side and maintain strict Firestore rules.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes, you can change your subscription at any time by contacting the admin on WhatsApp. The admin manually updates your plan and expiration date.",
  },
  {
    question: "Is there a payment API?",
    answer: "No. FlashTransacts uses a manual subscription workflow. Users contact the admin, and the admin activates access from the admin panel.",
  },
];

export const currencies = [
  "XAF", "XOF", "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "CNY", "INR", "SGD", "HKD", "NZD"
];

export const notificationTypes = [
  "Notification Received",
  "Notification Sent",
  "Deposit Notice",
  "Withdrawal Notice",
  "Transfer Notice",
  "Verification Notice",
  "Approval Notice",
  "Custom Notice",
];

export const durations = [
  { label: "1 Day", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
  { label: "180 Days", value: 180 },
  { label: "365 Days", value: 365 },
  { label: "Lifetime", value: -1 },
];

export const analyticsData = {
  dailyActivity: [
    { day: "Mon", sent: 0, delivered: 0, failed: 0 },
    { day: "Tue", sent: 0, delivered: 0, failed: 0 },
    { day: "Wed", sent: 0, delivered: 0, failed: 0 },
    { day: "Thu", sent: 0, delivered: 0, failed: 0 },
    { day: "Fri", sent: 0, delivered: 0, failed: 0 },
    { day: "Sat", sent: 0, delivered: 0, failed: 0 },
    { day: "Sun", sent: 0, delivered: 0, failed: 0 },
  ],
  monthlyActivity: [
    { month: "Jan", sent: 0, delivered: 0 },
    { month: "Feb", sent: 0, delivered: 0 },
    { month: "Mar", sent: 0, delivered: 0 },
    { month: "Apr", sent: 0, delivered: 0 },
    { month: "May", sent: 0, delivered: 0 },
    { month: "Jun", sent: 0, delivered: 0 },
  ],
  userGrowth: [
    { month: "Jan", users: 0 },
    { month: "Feb", users: 0 },
    { month: "Mar", users: 0 },
    { month: "Apr", users: 0 },
    { month: "May", users: 0 },
    { month: "Jun", users: 0 },
  ],
  templateUsage: [
    { name: "PayPal", value: 0 },
    { name: "Apple Pay", value: 0 },
    { name: "Venmo", value: 0 },
    { name: "Cash App", value: 0 },
    { name: "Zelle", value: 0 },
    { name: "Others", value: 0 },
  ],
};

export const activityLogs: Array<{ id: string; action: string; user: string; target: string; timestamp: string; ip: string }> = [];
