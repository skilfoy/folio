import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { fieldClass, StatusPill } from "@/components/folio/ui";
import { formatWhen, money, orderTotal } from "@/lib/orders/stats";
import type { Account, Order, OrderStatus } from "@/lib/orders/types";

const FILTERS: Array<{ id: "all" | OrderStatus; label: string }> = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export function Orders({ orders, accounts }: { orders: Order[]; accounts: Account[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const emailFor = (id: string) => accounts.find((account) => account.id === id)?.email ?? "";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (status !== "all" && order.status !== status) return false;
      if (!q) return true;
      const blob = `${order.id} ${emailFor(order.accountId)} ${order.items.map((item) => item.name).join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
  }, [orders, query, status, accounts]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search orders</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            className={`${fieldClass} pl-9`}
            value={query}
            placeholder="Search orders, products, accounts"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Order status">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={status === filter.id}
              className={`h-11 shrink-0 rounded-lg px-3 text-sm font-semibold ${
                status === filter.id ? "bg-accent text-accent-ink" : "bg-surface text-fg"
              }`}
              onClick={() => setStatus(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted">
        {visible.length} {visible.length === 1 ? "order" : "orders"}
      </p>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        {visible.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted">Nothing matches that search.</p>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((order) => {
              const open = openId === order.id;
              return (
                <li key={order.id}>
                  <button
                    type="button"
                    className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-surface-2"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : order.id)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg">{order.items[0]?.name}</p>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {order.id} · {formatWhen(order.placedAt)} · {emailFor(order.accountId)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm font-semibold tabular-nums">{money(orderTotal(order))}</span>
                      <StatusPill status={order.status} />
                    </div>
                  </button>
                  {open ? (
                    <ul className="border-t border-line bg-bg/60 px-4 py-2">
                      {order.items.map((item) => (
                        <li key={item.name} className="flex items-center justify-between gap-3 py-2 text-sm">
                          <span className="min-w-0 truncate text-fg">
                            {item.name}
                            <span className="text-muted"> × {item.qty}</span>
                          </span>
                          <span className="shrink-0 tabular-nums">{money(item.qty * item.priceCents)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
