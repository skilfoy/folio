import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Account, Order, OrderItem, OrderStatus } from "@/lib/orders/types";

type Ledger = { accounts: Account[]; orders: Order[] };

const STATUSES = new Set<OrderStatus>(["pending", "shipped", "delivered", "cancelled"]);

function accountId(userId: string, email: string): string {
  let h = 2166136261;
  const value = `${userId}\n${email}`;
  for (let i = 0; i < value.length; i += 1) h = Math.imul(h ^ value.charCodeAt(i), 16777619);
  return `acct_${(h >>> 0).toString(36)}`;
}

function asItems(value: unknown): OrderItem[] {
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as { name?: unknown; qty?: unknown; priceCents?: unknown };
    if (typeof row.name !== "string") return [];
    const qty = Number(row.qty);
    const priceCents = Number(row.priceCents);
    if (!Number.isFinite(qty) || !Number.isFinite(priceCents)) return [];
    return [{ name: row.name, qty, priceCents }];
  });
}

async function readLedger(userId: string): Promise<Ledger> {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const accounts = await sql<{
    id: string;
    email: string;
    host: string;
    auto_sync: boolean;
    last_sync_at: string | null;
    sync_error: string | null;
  }>`
    select id, email, host, auto_sync, last_sync_at, sync_error
    from folio_accounts
    where user_id = ${userId}
    order by created_at asc
  `;
  const orders = await sql<{
    id: string;
    account_id: string;
    placed_at: string;
    status: string;
    items: string;
  }>`
    select id, account_id, placed_at, status, items
    from folio_orders
    where user_id = ${userId}
    order by placed_at desc
  `;
  return {
    accounts: accounts.map((row) => ({
      id: row.id,
      retailer: "amazon" as const,
      host: "www.amazon.com" as const,
      email: row.email,
      lastSyncAt: row.last_sync_at,
      autoSync: row.auto_sync,
      syncError: row.sync_error,
    })),
    orders: orders.flatMap((row) => {
      if (!STATUSES.has(row.status as OrderStatus)) return [];
      return [
        {
          id: row.id,
          accountId: row.account_id,
          placedAt: row.placed_at,
          status: row.status as OrderStatus,
          items: asItems(row.items),
        },
      ];
    }),
  };
}

export const loadLedger = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Ledger> => readLedger(context.userId));

export const linkAmazonAccount = createServerFn({ method: "POST" })
  .validator((email: string) => {
    const cleaned = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleaned) || cleaned.length > 200) {
      throw new Error("Enter the Amazon email.");
    }
    return cleaned;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data: email }): Promise<Ledger> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const id = accountId(context.userId, email);
    await sql`
      insert into folio_accounts (id, user_id, email)
      values (${id}, ${context.userId}, ${email})
      on conflict (user_id, email) do nothing
    `;
    return readLedger(context.userId);
  });

export const setAccountAutoSync = createServerFn({ method: "POST" })
  .validator((input: { id: string; autoSync: boolean }) => {
    if (!input.id || typeof input.autoSync !== "boolean") throw new Error("Invalid account.");
    return input;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      update folio_accounts
      set auto_sync = ${data.autoSync}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return readLedger(context.userId);
  });

export const syncAmazonAccount = createServerFn({ method: "POST" })
  .validator((id: string) => {
    if (!id) throw new Error("Invalid account.");
    return id;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data: id }): Promise<Ledger> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      update folio_accounts
      set sync_error = null
      where id = ${id} and user_id = ${context.userId}
    `;
    return readLedger(context.userId);
  });

export const removeAmazonAccount = createServerFn({ method: "POST" })
  .validator((id: string) => {
    if (!id) throw new Error("Invalid account.");
    return id;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data: id }): Promise<Ledger> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`delete from folio_orders where account_id = ${id} and user_id = ${context.userId}`;
    await sql`delete from folio_accounts where id = ${id} and user_id = ${context.userId}`;
    return readLedger(context.userId);
  });

export const clearLedger = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Ledger> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`delete from folio_orders where user_id = ${context.userId}`;
    await sql`delete from folio_accounts where user_id = ${context.userId}`;
    return readLedger(context.userId);
  });
