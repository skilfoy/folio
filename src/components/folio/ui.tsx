import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { OrderStatus } from "@/lib/orders/types";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const BUTTON = {
  primary: "bg-accent text-accent-ink hover:opacity-90",
  ghost: "border border-line bg-surface text-fg hover:bg-surface-2",
} as const;

export function Button({
  variant = "ghost",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof BUTTON }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        BUTTON[variant],
        className,
      )}
      {...props}
    />
  );
}

export const fieldClass =
  "h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-fg placeholder:text-muted";

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-line bg-surface p-4 md:p-5", className)}>
      {title ? (
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="font-display text-lg text-fg">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Figure({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("num", className)}>{children}</span>;
}

export function StatusPill({ status }: { status: OrderStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "delivered" && "bg-accent/10 text-accent",
        status === "shipped" && "bg-surface-2 text-fg",
        status === "pending" && "bg-fg/5 text-fg",
        status === "cancelled" && "text-muted",
      )}
    >
      {label}
    </span>
  );
}

export function AmazonMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fg font-display text-base text-surface",
        className,
      )}
      aria-hidden
    >
      a
    </span>
  );
}
