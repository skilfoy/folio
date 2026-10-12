import { create } from "zustand";
import {
  clearLedger,
  linkAmazonAccount,
  loadLedger,
  removeAmazonAccount,
  setAccountAutoSync,
  syncAmazonAccount,
} from "@/lib/orders/api";
import type { Account, Order } from "@/lib/orders/types";

type LedgerState = {
  ready: boolean;
  accounts: Account[];
  orders: Order[];
  activeAccountId: string;
  wizardOpen: boolean;
  load: () => Promise<void>;
  setActiveAccount: (id: string) => void;
  openWizard: () => void;
  closeWizard: () => void;
  linkAccount: (email: string) => Promise<void>;
  setAutoSync: (id: string, autoSync: boolean) => Promise<void>;
  syncAccount: (id: string) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
};

function apply(
  set: (partial: Partial<LedgerState>) => void,
  get: () => LedgerState,
  data: { accounts: Account[]; orders: Order[] },
) {
  const active = get().activeAccountId;
  const stillThere = active === "all" || data.accounts.some((account) => account.id === active);
  set({
    ready: true,
    accounts: data.accounts,
    orders: data.orders,
    activeAccountId: stillThere ? active : "all",
    wizardOpen: false,
  });
}

export const useLedger = create<LedgerState>((set, get) => ({
  ready: false,
  accounts: [],
  orders: [],
  activeAccountId: "all",
  wizardOpen: false,

  load: async () => {
    const data = await loadLedger();
    const active = get().activeAccountId;
    const stillThere = active === "all" || data.accounts.some((account) => account.id === active);
    set({
      ready: true,
      accounts: data.accounts,
      orders: data.orders,
      activeAccountId: stillThere ? active : "all",
    });
  },

  setActiveAccount: (id) => set({ activeAccountId: id }),
  openWizard: () => set({ wizardOpen: true }),
  closeWizard: () => set({ wizardOpen: false }),

  linkAccount: async (email) => {
    apply(set, get, await linkAmazonAccount({ data: email }));
  },

  setAutoSync: async (id, autoSync) => {
    apply(set, get, await setAccountAutoSync({ data: { id, autoSync } }));
  },

  syncAccount: async (id) => {
    apply(set, get, await syncAmazonAccount({ data: id }));
  },

  removeAccount: async (id) => {
    apply(set, get, await removeAmazonAccount({ data: id }));
  },

  clearAll: async () => {
    apply(set, get, await clearLedger());
  },
}));

export function ordersForAccount(orders: Order[], activeAccountId: string): Order[] {
  if (activeAccountId === "all") return orders;
  return orders.filter((order) => order.accountId === activeAccountId);
}
