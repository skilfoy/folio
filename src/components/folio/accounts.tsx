import { useMemo, useState, type FormEvent } from "react";
import { Eye, EyeOff, Filter, RefreshCw, Search, X } from "lucide-react";
import { AmazonMark, Button, fieldClass } from "@/components/folio/ui";
import { relativeTime } from "@/lib/orders/stats";
import type { Account } from "@/lib/orders/types";

const PAGE = 6;

export function Accounts({
  accounts,
  onSync,
  onAutoSync,
  onRemove,
  onAdd,
}: {
  accounts: Account[];
  onSync: (id: string) => void;
  onAutoSync: (id: string, on: boolean) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  const [query, setQuery] = useState("");
  const [autoOnly, setAutoOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [manageId, setManageId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts.filter((account) => {
      if (autoOnly && !account.autoSync) return false;
      if (!q) return true;
      return account.email.includes(q) || account.host.includes(q);
    });
  }, [accounts, query, autoOnly]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const safePage = Math.min(page, pages - 1);
  const slice = filtered.slice(safePage * PAGE, safePage * PAGE + PAGE);
  const managing = accounts.find((account) => account.id === manageId) ?? null;

  function sync(id: string) {
    setSyncingId(id);
    window.setTimeout(() => {
      onSync(id);
      setSyncingId(null);
    }, 700);
  }

  return (
    <div className="rounded-xl border border-line bg-surface">
      <div className="flex flex-col gap-3 border-b border-line px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
        <h1 className="font-display text-3xl text-fg">Accounts</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={autoOnly}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-fg hover:bg-surface-2"
            onClick={() => {
              setAutoOnly((value) => !value);
              setPage(0);
            }}
          >
            <Filter className="h-4 w-4" />
            {autoOnly ? "Auto sync on" : "Filter"}
          </button>
          <Button variant="primary" onClick={onAdd}>
            Add Account
          </Button>
        </div>
      </div>

      <div className="px-4 py-4 md:px-5">
        <label className="relative block max-w-xs">
          <span className="sr-only">Search accounts</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            className={`${fieldClass} pl-9`}
            placeholder="Search accounts"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
          />
        </label>
      </div>

      <div className="hidden grid-cols-[1.3fr_1.4fr_0.9fr_0.8fr_auto] gap-3 border-y border-line px-5 py-2 text-xs font-semibold tracking-wide text-muted uppercase md:grid">
        <span>Retailer</span>
        <span>Account</span>
        <span>Last sync</span>
        <span>Auto sync</span>
        <span className="text-right">Actions</span>
      </div>

      {slice.length === 0 ? (
        <p className="px-5 py-10 text-sm text-muted">No Amazon accounts on this list yet.</p>
      ) : (
        <ul className="divide-y divide-line">
          {slice.map((account) => (
            <li key={account.id} className="flex flex-col gap-3 px-4 py-4 md:grid md:grid-cols-[1.3fr_1.4fr_0.9fr_0.8fr_auto] md:items-center md:gap-3 md:px-5">
              <div className="flex items-center gap-3">
                <AmazonMark />
                <div>
                  <p className="text-sm font-semibold text-fg">Amazon</p>
                  <p className="text-xs text-muted">{account.host}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  {account.email.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm text-fg">{account.email}</p>
                  {account.syncError ? <p className="text-xs text-fg">{account.syncError}</p> : null}
                </div>
              </div>
              <p className="text-sm text-muted" suppressHydrationWarning>
                {relativeTime(account.lastSyncAt)}
              </p>
              <p className={`text-sm font-semibold ${account.autoSync ? "text-accent" : "text-muted"}`}>
                {account.autoSync ? "Enabled" : "Off"}
              </p>
              <div className="flex gap-2 md:justify-end">
                <button
                  type="button"
                  className="h-11 rounded-lg border border-line px-3 text-sm font-semibold text-accent hover:bg-surface-2"
                  onClick={() => setManageId(account.id)}
                >
                  Manage
                </button>
                <Button variant="primary" onClick={() => sync(account.id)} disabled={syncingId === account.id}>
                  <RefreshCw className={`h-4 w-4 ${syncingId === account.id ? "animate-spin" : ""}`} />
                  {syncingId === account.id ? "Syncing" : "Sync"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm text-muted md:px-5">
        <span>
          {filtered.length === 0
            ? "Showing 0"
            : `Showing ${safePage * PAGE + 1}–${Math.min(filtered.length, safePage * PAGE + slice.length)} of ${filtered.length}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-11 px-2 disabled:opacity-40"
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
          >
            Prev
          </button>
          <span className="grid h-9 w-9 place-items-center rounded-md bg-accent text-sm font-semibold text-accent-ink">
            {safePage + 1}
          </span>
          <button
            type="button"
            className="h-11 px-2 disabled:opacity-40"
            disabled={safePage >= pages - 1}
            onClick={() => setPage(safePage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {managing ? (
        <ManageDialog
          account={managing}
          onClose={() => setManageId(null)}
          onAutoSync={onAutoSync}
          onRemove={() => {
            onRemove(managing.id);
            setManageId(null);
          }}
        />
      ) : null}
    </div>
  );
}

function ManageDialog({
  account,
  onClose,
  onAutoSync,
  onRemove,
}: {
  account: Account;
  onClose: () => void;
  onAutoSync: (id: string, on: boolean) => void;
  onRemove: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-fg/40 p-4" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-title"
        className="w-full max-w-md rounded-xl bg-surface p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="manage-title" className="font-display text-2xl text-fg">
            Manage account
          </h2>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-surface-2" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-sm text-fg">{account.email}</p>
        <p className="text-sm text-muted">Amazon · {account.host}</p>
        <label className="mt-5 flex items-center justify-between gap-3 text-sm font-semibold">
          Auto sync
          <input
            type="checkbox"
            className="h-5 w-5 accent-accent"
            checked={account.autoSync}
            onChange={(event) => onAutoSync(account.id, event.target.checked)}
          />
        </label>
        <div className="mt-6 flex justify-between gap-2">
          <button type="button" className="h-11 rounded-lg px-3 text-sm font-semibold text-fg hover:bg-surface-2" onClick={onRemove}>
            Remove account
          </button>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  { n: 1, title: "Select a Retailer", hint: "Choose a store" },
  { n: 2, title: "Sign In", hint: "Login to your account" },
  { n: 3, title: "Authorize Account", hint: "Confirm account access" },
  { n: 4, title: "Completed", hint: "Your account has been linked" },
] as const;

export function AddAccountWizard({
  open,
  onClose,
  onLinked,
}: {
  open: boolean;
  onClose: () => void;
  onLinked: (email: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  function resetAndClose() {
    setStep(1);
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setAgreed(false);
    setError("");
    onClose();
  }

  function login(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@") || password.length < 6 || !agreed) {
      setError("Enter the Amazon email, a password of at least 6 characters, and accept the terms.");
      return;
    }
    setPassword("");
    setError("");
    setStep(3);
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-fg/40 p-3" role="presentation" onClick={resetAndClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-account-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="add-account-title" className="text-base font-semibold text-fg">
            Add New Account
          </h2>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-surface-2" aria-label="Close" onClick={resetAndClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 px-5 py-6 md:grid-cols-[14rem_minmax(0,1fr)]">
          <ol className="flex gap-4 overflow-x-auto md:flex-col md:gap-0">
            {STEPS.map((item, index) => {
              const active = step === item.n;
              return (
                <li key={item.n} className="flex min-w-40 gap-3 md:min-w-0 md:pb-6">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-semibold ${
                        active ? "bg-accent text-accent-ink" : "bg-accent/10 text-accent"
                      }`}
                    >
                      {item.n}
                    </span>
                    {index < STEPS.length - 1 ? <span className="mt-1 hidden h-full w-px bg-line md:block" /> : null}
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-sm font-semibold ${active ? "text-fg" : "text-muted"}`}>{item.title}</p>
                    <p className="text-xs text-muted">{item.hint}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div>
            {step === 1 ? (
              <div>
                <h3 className="font-display text-2xl text-fg">Choose Retailer</h3>
                <p className="mt-1 text-sm text-muted">Select the retailer you want to connect your account with.</p>
                <div className="mt-5 w-full max-w-xs rounded-xl border border-accent bg-accent/5 p-4">
                  <div className="flex items-center gap-3">
                    <AmazonMark />
                    <div>
                      <p className="font-semibold text-fg">Amazon</p>
                      <p className="text-xs text-muted">www.amazon.com</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button variant="primary" onClick={() => setStep(2)}>
                    Continue
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <form onSubmit={login}>
                <h3 className="font-display text-2xl text-fg">Amazon Account Info</h3>
                <p className="mt-1 text-sm text-muted">Use the email and password for the Amazon account you are adding.</p>
                <label className="mt-4 block text-sm font-semibold text-fg">
                  Email
                  <input
                    className={`${fieldClass} mt-1`}
                    type="email"
                    autoComplete="username"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>
                <label className="mt-3 block text-sm font-semibold text-fg">
                  Password
                  <span className="relative mt-1 block">
                    <input
                      className={`${fieldClass} pr-12`}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-1 grid h-10 w-10 -translate-y-1/2 place-items-center text-muted"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </span>
                </label>
                <label className="mt-4 flex items-start gap-2 text-sm text-muted">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-accent" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
                  <span>By clicking Login, I agree that I have read and accepted the terms of this link.</span>
                </label>
                {error ? <p className="mt-3 text-sm font-semibold text-fg">{error}</p> : null}
                <div className="mt-6 flex justify-end">
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                </div>
              </form>
            ) : null}

            {step === 3 ? (
              <div>
                <h3 className="font-display text-2xl text-fg">Authorize Account</h3>
                <p className="mt-1 text-sm text-muted">Confirm {email} at www.amazon.com is the account to add.</p>
                <div className="mt-5 rounded-xl border border-line p-4">
                  <p className="text-sm font-semibold text-fg">{email}</p>
                  <p className="text-sm text-muted">Amazon · www.amazon.com</p>
                </div>
                <div className="mt-8 flex justify-end gap-2">
                  <Button onClick={() => setStep(2)}>Back</Button>
                  <Button variant="primary" onClick={() => setStep(4)}>
                    Authorize
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div>
                <h3 className="font-display text-2xl text-fg">Account linked</h3>
                <p className="mt-1 text-sm text-muted">{email} is now on your Accounts list.</p>
                <div className="mt-8 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      onLinked(email);
                      resetAndClose();
                    }}
                  >
                    Done
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
