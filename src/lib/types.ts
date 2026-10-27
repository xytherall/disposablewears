export type Variant = {
  id: string;
  name: string;
  price: number;
  stock: number;
  sort: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  description: string;
  features: string[];
  unit: string;
  art: string | null;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  sort: number;
  variants: Variant[];
};

export type StoreSettings = {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  delivery_fee: number;
  free_delivery_min: number;
  bank_name: string;
  bank_account_title: string;
  bank_account_no: string;
  bank_iban: string;
  jazzcash_no: string;
  jazzcash_name: string;
  easypaisa_no: string;
  easypaisa_name: string;
  announcement: string;
};

export type PaymentMethod = "cod" | "bank" | "jazzcash" | "easypaisa";

export type OrderLine = {
  variant_id: string;
  slug: string;
  product: string;
  variant: string;
  unit: string;
  price: number;
  quantity: number;
  line_total: number;
};

export type Order = {
  id: string;
  order_no: number;
  customer_name: string;
  phone: string;
  email: string | null;
  business_name: string | null;
  city: string;
  address: string;
  notes: string | null;
  items: OrderLine[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_reference: string | null;
  payment_proof_path: string | null;
  payment_status: "unpaid" | "pending_verification" | "paid" | "refunded";
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  admin_notes: string | null;
  created_at: string;
};

export type QuoteRequest = {
  id: string;
  name: string;
  business_name: string | null;
  business_type: string | null;
  phone: string;
  email: string | null;
  city: string | null;
  products: string;
  message: string | null;
  status: "new" | "contacted" | "won" | "lost";
  created_at: string;
};
