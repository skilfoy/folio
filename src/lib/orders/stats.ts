import type { Order, OrderStatus } from "@/lib/orders/types";

export function orderTotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.qty * item.priceCents, 0);
}

export function money(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function formatWhen(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
}

export function relativeTime(iso: string | null): string {
  if (!iso) return "Not synced";
  const delta = Math.max(0, Date.now() - Date.parse(iso));
  const minutes = Math.round(delta / 60000);
  if (minutes < 2) return "Just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return days === 1 ? "1 day ago" : `${days} days ago`;
  const months = Math.round(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export type ProductRank = {
  name: string;
  qty: number;
  spentCents: number;
};

export type Summary = {
  total: number;
  shipped: number;
  delivered: number;
  pending: number;
  cancelled: number;
  spentCents: number;
  averageCents: number;
  pendingCents: number;
  latest: Order[];
  topProducts: ProductRank[];
};

export function summarize(orders: Order[]): Summary {
  const counts: Record<OrderStatus, number> = {
    pending: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  let spentCents = 0;
  let pendingCents = 0;
  const products = new Map<string, ProductRank>();

  for (const order of orders) {
    counts[order.status] += 1;
    const total = orderTotal(order);
    if (order.status !== "cancelled") spentCents += total;
    if (order.status === "pending") pendingCents += total;
    for (const item of order.items) {
      const current = products.get(item.name) ?? { name: item.name, qty: 0, spentCents: 0 };
      current.qty += item.qty;
      current.spentCents += item.qty * item.priceCents;
      products.set(item.name, current);
    }
  }

  const billable = orders.length - counts.cancelled;
  const latest = [...orders].sort((a, b) => (a.placedAt < b.placedAt ? 1 : -1)).slice(0, 6);
  const topProducts = [...products.values()].sort((a, b) => b.qty - a.qty || b.spentCents - a.spentCents).slice(0, 6);

  return {
    total: orders.length,
    shipped: counts.shipped,
    delivered: counts.delivered,
    pending: counts.pending,
    cancelled: counts.cancelled,
    spentCents,
    averageCents: billable > 0 ? Math.round(spentCents / billable) : 0,
    pendingCents,
    latest,
    topProducts,
  };
}
