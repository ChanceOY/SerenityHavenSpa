import type { PaymentMethod } from "@/lib/types";

export function createReceiptNumber(date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SHS-R-${stamp}-${random}`;
}

export function paymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    CASH: "Cash",
    MOBILE_MONEY: "Mobile Money",
    CARD: "Card",
    BANK_TRANSFER: "Bank Transfer",
  };

  return labels[method];
}
