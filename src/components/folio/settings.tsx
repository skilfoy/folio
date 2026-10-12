import { Panel } from "@/components/folio/ui";

export function Settings({
  accountCount,
  onClear,
}: {
  accountCount: number;
  onClear: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Panel title="Linked accounts">
        <p className="text-sm text-muted">
          {accountCount === 0
            ? "No Amazon accounts are linked."
            : `${accountCount} Amazon ${accountCount === 1 ? "account is" : "accounts are"} linked. Removing one deletes its orders from Folio.`}
        </p>
        {accountCount > 0 ? (
          <button
            type="button"
            className="mt-4 h-11 rounded-lg border border-line px-4 text-sm font-semibold text-fg hover:bg-surface-2"
            onClick={onClear}
          >
            Remove all accounts
          </button>
        ) : null}
      </Panel>
    </div>
  );
}
