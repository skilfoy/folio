export type RetailerId = "amazon";

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  name: string;
  qty: number;
  priceCents: number;
};

export type Order = {
  id: string;
  accountId: string;
  placedAt: string;
  status: OrderStatus;
  items: OrderItem[];
};

export type Account = {
  id: string;
  retailer: RetailerId;
  host: "www.amazon.com";
  email: string;
  lastSyncAt: string | null;
  autoSync: boolean;
  syncError?: string | null;
};

export type Stored = {
  folio: 4;
  accounts: Account[];
  orders: Order[];
  activeAccountId: string;
};
