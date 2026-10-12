import { Figure, Panel, StatusPill } from "@/components/folio/ui";
import { formatWhen, money, orderTotal, summarize } from "@/lib/orders/stats";
import type { Account, Order } from "@/lib/orders/types";

export function Dashboard({
  orders,
  accounts,
  onOpenOrders,
}: {
  orders: Order[];
  accounts: Account[];
  onOpenOrders: () => void;
}) {
  const summary = summarize(orders);
  const emailFor = (id: string) => accounts.find((account) => account.id === id)?.email ?? "Account";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total orders" value={String(summary.total)} hint="Every status" />
        <Stat label="Shipped" value={String(summary.shipped)} hint="In transit" />
        <Stat label="Delivered" value={String(summary.delivered)} hint="Received" />
        <Stat label="Pending" value={String(summary.pending)} hint="Not shipped yet" />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="Total spent" value={money(summary.spentCents)} hint="Excludes cancelled" />
        <Stat label="Average order" value={money(summary.averageCents)} hint="Across billed orders" />
        <Stat label="Pending value" value={money(summary.pendingCents)} hint="Still open" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel
          title="Latest orders"
          action={
            <button type="button" className="text-sm font-semibold text-accent" onClick={onOpenOrders}>
              View all
            </button>
          }
        >
          {summary.latest.length === 0 ? (
            <p className="text-sm text-muted">No orders for this account yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {summary.latest.map((order) => (
                <li key={order.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-fg">{order.items[0]?.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {formatWhen(order.placedAt)} · {emailFor(order.accountId)}
                      {order.items.length > 1 ? ` · +${order.items.length - 1} more` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-sm font-semibold tabular-nums">{money(orderTotal(order))}</span>
                    <StatusPill status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Top products" action={<span className="text-xs text-muted">By quantity</span>}>
          {summary.topProducts.length === 0 ? (
            <p className="text-sm text-muted">Products show up after a sync.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {summary.topProducts.map((product, index) => (
                <li key={product.name} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-semibold text-muted">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-fg">{product.name}</p>
                    <p className="text-xs text-muted">{money(product.spentCents)}</p>
                  </div>
                  <span className="num text-lg text-fg">{product.qty}</span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-4">
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
      <p className="num mt-2 text-3xl text-fg">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
