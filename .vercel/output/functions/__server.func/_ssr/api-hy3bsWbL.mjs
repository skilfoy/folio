import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-jwEEWmOB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-hy3bsWbL.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var STATUSES = /* @__PURE__ */ new Set([
	"pending",
	"shipped",
	"delivered",
	"cancelled"
]);
function accountId(userId, email) {
	let h = 2166136261;
	const value = `${userId}\n${email}`;
	for (let i = 0; i < value.length; i += 1) h = Math.imul(h ^ value.charCodeAt(i), 16777619);
	return `acct_${(h >>> 0).toString(36)}`;
}
function asItems(value) {
	const parsed = typeof value === "string" ? JSON.parse(value) : value;
	if (!Array.isArray(parsed)) return [];
	return parsed.flatMap((item) => {
		if (!item || typeof item !== "object") return [];
		const row = item;
		if (typeof row.name !== "string") return [];
		const qty = Number(row.qty);
		const priceCents = Number(row.priceCents);
		if (!Number.isFinite(qty) || !Number.isFinite(priceCents)) return [];
		return [{
			name: row.name,
			qty,
			priceCents
		}];
	});
}
async function readLedger(userId) {
	const { getSql } = await import("./db-ZavYao0D.mjs").then((n) => n.t).then((n) => n.t);
	const sql = await getSql();
	const accounts = await sql`
    select id, email, host, auto_sync, last_sync_at, sync_error
    from folio_accounts
    where user_id = ${userId}
    order by created_at asc
  `;
	const orders = await sql`
    select id, account_id, placed_at, status, items
    from folio_orders
    where user_id = ${userId}
    order by placed_at desc
  `;
	return {
		accounts: accounts.map((row) => ({
			id: row.id,
			retailer: "amazon",
			host: "www.amazon.com",
			email: row.email,
			lastSyncAt: row.last_sync_at,
			autoSync: row.auto_sync,
			syncError: row.sync_error
		})),
		orders: orders.flatMap((row) => {
			if (!STATUSES.has(row.status)) return [];
			return [{
				id: row.id,
				accountId: row.account_id,
				placedAt: row.placed_at,
				status: row.status,
				items: asItems(row.items)
			}];
		})
	};
}
var loadLedger_createServerFn_handler = createServerRpc({
	id: "13c3e3c4ee97861eb7711e85bde14c923a14c0849f259bf1267b91c7092d94bf",
	name: "loadLedger",
	filename: "src/lib/orders/api.ts"
}, (opts) => loadLedger.__executeServer(opts));
var loadLedger = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadLedger_createServerFn_handler, async ({ context }) => readLedger(context.userId));
var linkAmazonAccount_createServerFn_handler = createServerRpc({
	id: "3568e796e41cb27491ad52a54ddba4f5cd39ccc63cb3881032cf73184a9b8e28",
	name: "linkAmazonAccount",
	filename: "src/lib/orders/api.ts"
}, (opts) => linkAmazonAccount.__executeServer(opts));
var linkAmazonAccount = createServerFn({ method: "POST" }).validator((email) => {
	const cleaned = email.trim().toLowerCase();
	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleaned) || cleaned.length > 200) throw new Error("Enter the Amazon email.");
	return cleaned;
}).middleware([authMiddleware]).handler(linkAmazonAccount_createServerFn_handler, async ({ context, data: email }) => {
	const { getSql } = await import("./db-ZavYao0D.mjs").then((n) => n.t).then((n) => n.t);
	await (await getSql())`
      insert into folio_accounts (id, user_id, email)
      values (${accountId(context.userId, email)}, ${context.userId}, ${email})
      on conflict (user_id, email) do nothing
    `;
	return readLedger(context.userId);
});
var setAccountAutoSync_createServerFn_handler = createServerRpc({
	id: "70773cb8550d507a92dc63790ce0b4c7aff9318d247a3f350ae30426db10ee9b",
	name: "setAccountAutoSync",
	filename: "src/lib/orders/api.ts"
}, (opts) => setAccountAutoSync.__executeServer(opts));
var setAccountAutoSync = createServerFn({ method: "POST" }).validator((input) => {
	if (!input.id || typeof input.autoSync !== "boolean") throw new Error("Invalid account.");
	return input;
}).middleware([authMiddleware]).handler(setAccountAutoSync_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-ZavYao0D.mjs").then((n) => n.t).then((n) => n.t);
	await (await getSql())`
      update folio_accounts
      set auto_sync = ${data.autoSync}
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return readLedger(context.userId);
});
var syncAmazonAccount_createServerFn_handler = createServerRpc({
	id: "4e0fa0c65acf8b8d6ec83fa38e2eb634280490c54187e8953e8bbb6aa8428644",
	name: "syncAmazonAccount",
	filename: "src/lib/orders/api.ts"
}, (opts) => syncAmazonAccount.__executeServer(opts));
var syncAmazonAccount = createServerFn({ method: "POST" }).validator((id) => {
	if (!id) throw new Error("Invalid account.");
	return id;
}).middleware([authMiddleware]).handler(syncAmazonAccount_createServerFn_handler, async ({ context, data: id }) => {
	const { getSql } = await import("./db-ZavYao0D.mjs").then((n) => n.t).then((n) => n.t);
	await (await getSql())`
      update folio_accounts
      set sync_error = null
      where id = ${id} and user_id = ${context.userId}
    `;
	return readLedger(context.userId);
});
var removeAmazonAccount_createServerFn_handler = createServerRpc({
	id: "54780a91376b66897a816a429e2a86c4b26cc77110eacd62f87b19e2a00251c4",
	name: "removeAmazonAccount",
	filename: "src/lib/orders/api.ts"
}, (opts) => removeAmazonAccount.__executeServer(opts));
var removeAmazonAccount = createServerFn({ method: "POST" }).validator((id) => {
	if (!id) throw new Error("Invalid account.");
	return id;
}).middleware([authMiddleware]).handler(removeAmazonAccount_createServerFn_handler, async ({ context, data: id }) => {
	const { getSql } = await import("./db-ZavYao0D.mjs").then((n) => n.t).then((n) => n.t);
	const sql = await getSql();
	await sql`delete from folio_orders where account_id = ${id} and user_id = ${context.userId}`;
	await sql`delete from folio_accounts where id = ${id} and user_id = ${context.userId}`;
	return readLedger(context.userId);
});
var clearLedger_createServerFn_handler = createServerRpc({
	id: "a2476a5097d09d705747546587c9f82114ff9a5d9768c7f4336797b809cfbc7c",
	name: "clearLedger",
	filename: "src/lib/orders/api.ts"
}, (opts) => clearLedger.__executeServer(opts));
var clearLedger = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(clearLedger_createServerFn_handler, async ({ context }) => {
	const { getSql } = await import("./db-ZavYao0D.mjs").then((n) => n.t).then((n) => n.t);
	const sql = await getSql();
	await sql`delete from folio_orders where user_id = ${context.userId}`;
	await sql`delete from folio_accounts where user_id = ${context.userId}`;
	return readLedger(context.userId);
});
//#endregion
export { clearLedger_createServerFn_handler, linkAmazonAccount_createServerFn_handler, loadLedger_createServerFn_handler, removeAmazonAccount_createServerFn_handler, setAccountAutoSync_createServerFn_handler, syncAmazonAccount_createServerFn_handler };
