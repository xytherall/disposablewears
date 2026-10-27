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

type DeliverySettings = { free_delivery_city: string; delivery_fee: number; free_delivery_min: number };

function sameCity(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

// Returns the delivery charge, or null when it will be confirmed after the
// order (other cities, when no flat fee is set). Keep in sync with place_order
// in supabase/schema.sql.
export function deliveryFeeFor(subtotal: number, city: string, s: DeliverySettings): number | null {
  if (subtotal <= 0) return 0;
  if (s.free_delivery_city && city && sameCity(city, s.free_delivery_city)) return 0;
  if (s.free_delivery_min > 0 && subtotal >= s.free_delivery_min) return 0;
  if (!city) return null;
  return s.delivery_fee > 0 ? s.delivery_fee : null;
}

export function deliveryLabel(fee: number | null) {
  if (fee === null) return "To be confirmed";
  return fee === 0 ? "Free" : formatPKR(fee);
}

export const PK_CITIES = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Gujranwala",
  "Sialkot", "Hyderabad", "Bahawalpur", "Sargodha", "Sukkur", "Abbottabad", "Sheikhupura", "Gujrat", "Sahiwal",
  "Okara", "Kasur", "Rahim Yar Khan", "Mardan", "Dera Ghazi Khan", "Jhelum", "Mirpur",
];

export function paymentAccountReady(
  method: "cod" | "bank" | "jazzcash" | "easypaisa",
  s: { bank_account_no: string; bank_iban: string; jazzcash_no: string; easypaisa_no: string },
) {
  if (method === "bank") return Boolean(s.bank_account_no || s.bank_iban);
  if (method === "jazzcash") return Boolean(s.jazzcash_no);
  if (method === "easypaisa") return Boolean(s.easypaisa_no);
  return true;
}
