export const features = [
  {
    icon: "Mail",
    title: "Email Delivery",
    description: "High-performance email delivery with real-time tracking, delivery confirmation, and reusable brand-safe previews.",
  },
  {
    icon: "BarChart3",
    title: "Analytics",
    description: "Comprehensive analytics dashboard with real-time insights into notification performance and user engagement.",
  },
  {
    icon: "LayoutTemplate",
    title: "Templates",
    description: "Beautiful, customizable email templates with visual builder and live preview capabilities.",
  },
  {
    icon: "Bell",
    title: "Notifications",
    description: "Multi-platform notification system supporting various financial service providers and custom templates.",
  },
  {
    icon: "Users",
    title: "User Management",
    description: "Advanced user management with role-based access control, manual subscription activation, and activity tracking.",
  },
  {
    icon: "Shield",
    title: "Admin Controls",
    description: "Powerful admin panel with subscription management, audit logs, and security controls.",
  },
];

export const modules = [
  { name: "PayPal", description: "PayPal-style transaction notifications with authentic branding and layout.", color: "#003087" },
  { name: "Apple Pay", description: "Apple Pay-style notifications with sleek, minimalist design.", color: "#000000" },
  { name: "Venmo", description: "Venmo-style transaction notifications with modern aesthetics.", color: "#008CFF" },
  { name: "Cash App", description: "Cash App-style notifications with bold, distinctive branding.", color: "#00D632" },
  { name: "Zelle", description: "Zelle-style bank transfer notifications with professional formatting.", color: "#6C1D45" },
  { name: "Chime", description: "Chime-style banking notifications with clean, friendly design.", color: "#1CAAD9" },
  { name: "Interac", description: "Interac e-Transfer notifications with Canadian banking standards.", color: "#FF6B00" },
  { name: "Coinbase", description: "Coinbase-style crypto transaction notifications with modern crypto aesthetics.", color: "#0052FF" },
  { name: "Binance", description: "Binance-style trading notifications with dynamic crypto branding.", color: "#F0B90B" },
  { name: "Custom", description: "Fully customizable notification templates with your own branding and design.", color: "#D4AF37" },
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
    answer: "The dashboard provides detailed delivery logs, opening activity, and status tracking so admins can review every notification run.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use Firebase with role-based access control, encrypted storage, and follow SOC 2 compliance standards. All data is encrypted at rest and in transit.",
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
