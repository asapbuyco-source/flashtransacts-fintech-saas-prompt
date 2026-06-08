import type { User } from "@/store/authStore";

export function isSubscriptionActive(user: User | null | undefined) {
  if (!user || user.status !== "active") {
    return false;
  }

  if (user.subscriptionType === "Lifetime") {
    return true;
  }

  if (!user.subscriptionEnd) {
    return false;
  }

  return new Date(user.subscriptionEnd).getTime() >= Date.now();
}

export function getDaysRemaining(user: User | null | undefined) {
  if (!user?.subscriptionEnd) {
    return null;
  }

  if (user.subscriptionType === "Lifetime") {
    return "Lifetime";
  }

  return Math.max(0, Math.ceil((new Date(user.subscriptionEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))).toString();
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function addDaysToToday(days: number) {
  if (days < 0) {
    return "2099-12-31";
  }

  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}
