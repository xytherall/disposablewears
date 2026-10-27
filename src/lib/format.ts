export function formatPKR(amount: number) {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

export function lowestPrice(prices: number[]) {
  return prices.length ? Math.min(...prices) : 0;
}

export function whatsappLink(number: string, text?: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function orderLabel(orderNo: number) {
  return `DW-${orderNo}`;
}

export const PAYMENT_LABELS = {
  cod: "Cash on Delivery",
  bank: "Bank transfer",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
} as const;

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Karachi",
  });
}
