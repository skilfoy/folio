import { useEffect, useState } from "react";
import { LayoutDashboard, Receipt, Settings, Users } from "lucide-react";
import { Accounts, AddAccountWizard } from "@/components/folio/accounts";
import { Dashboard } from "@/components/folio/dashboard";
import { LoginScreen } from "@/components/folio/login-screen";
import { Orders } from "@/components/folio/orders";
import { Settings as SettingsView } from "@/components/folio/settings";
import { AmazonMark, cn, fieldClass } from "@/components/folio/ui";
import { SignInGate, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ordersForAccount, useLedger } from "@/lib/orders/store";

const VIEWS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: Receipt },
  { id: "accounts", label: "Accounts", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

export function FolioApp() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <SignInGate fallback={<LoginScreen />}>
        <Workspace />
      </SignInGate>
    </div>
  );
}

function Workspace() {
  const [view, setView] = useState<ViewId>("dashboard");
  const ready = useLedger((state) => state.ready);
  const accounts = useLedger((state) => state.accounts);
  const orders = useLedger((state) => state.orders);
  const activeAccountId = useLedger((state) => state.activeAccountId);
  const wizardOpen = useLedger((state) => state.wizardOpen);
  const load = useLedger((state) => state.load);
  const setActiveAccount = useLedger((state) => state.setActiveAccount);
  const openWizard = useLedger((state) => state.openWizard);
  const closeWizard = useLedger((state) => state.closeWizard);
  const linkAccount = useLedger((state) => state.linkAccount);
  const setAutoSync = useLedger((state) => state.setAutoSync);
  const syncAccount = useLedger((state) => state.syncAccount);
  const removeAccount = useLedger((state) => state.removeAccount);
  const clearAll = useLedger((state) => state.clearAll);

  const { user } = useCurrentUserState();

  useEffect(() => {
    if (!user) return;
    void load();
  }, [user?.id, load]);

  const visibleOrders = ordersForAccount(orders, activeAccountId);
  const active = accounts.find((account) => account.id === activeAccountId);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="sticky top-0 z-20 flex items-center border-b border-line bg-surface px-4 py-3 lg:h-screen lg:flex-col lg:items-stretch lg:border-r lg:border-b-0 lg:px-4 lg:py-6">
          <p className="font-display text-3xl tracking-tight text-accent">folio</p>
          <nav className="mt-8 hidden flex-1 flex-col gap-1 lg:flex" aria-label="Sections">
            {VIEWS.map((item) => {
              const Icon = item.icon;
              const on = view === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold",
                    on ? "bg-accent/10 text-accent" : "text-fg hover:bg-surface-2",
                  )}
                  aria-current={on ? "page" : undefined}
                  onClick={() => setView(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="flex flex-col gap-3 border-b border-line bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <label className="flex min-w-0 items-center gap-2 text-sm">
              {active ? <AmazonMark className="h-8 w-8 text-sm" /> : <span className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-xs font-semibold">All</span>}
              <span className="sr-only">Select account</span>
              <select
                className={`${fieldClass} max-w-xs`}
                value={activeAccountId}
                onChange={(event) => setActiveAccount(event.target.value)}
              >
                <option value="all">All accounts</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.email}
                  </option>
                ))}
              </select>
            </label>
            <UserButton />
          </header>

          <main className="px-4 py-5 pb-24 md:px-6 md:py-6 lg:pb-6">
            {!ready ? <p className="text-sm text-muted">Loading your accounts and orders…</p> : null}
            {ready && view === "dashboard" ? (
              accounts.length === 0 ? (
                <Empty onAdd={openWizard} />
              ) : (
                <Dashboard orders={visibleOrders} accounts={accounts} onOpenOrders={() => setView("orders")} />
              )
            ) : null}
            {ready && view === "orders" ? <Orders orders={visibleOrders} accounts={accounts} /> : null}
            {ready && view === "accounts" ? (
              <Accounts
                accounts={accounts}
                onSync={syncAccount}
                onAutoSync={setAutoSync}
                onRemove={removeAccount}
                onAdd={openWizard}
              />
            ) : null}
            {ready && view === "settings" ? <SettingsView accountCount={accounts.length} onClear={clearAll} /> : null}
          </main>
        </div>
      </div>

      <AddAccountWizard open={wizardOpen} onClose={closeWizard} onLinked={linkAccount} />
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-surface lg:hidden" aria-label="Mobile sections">
        {VIEWS.map((item) => {
          const Icon = item.icon;
          const on = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={cn(
                "flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold",
                on ? "text-accent" : "text-muted",
              )}
              aria-current={on ? "page" : undefined}
              onClick={() => setView(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function Empty({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-6 py-12 text-center">
      <h1 className="font-display text-3xl text-fg">Dashboard</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        Spending, shipments, and top products land here after an Amazon account on the Accounts page has orders.
      </p>
      <button type="button" className="mt-6 h-11 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink" onClick={onAdd}>
        Add Account
      </button>
    </div>
  );
}
