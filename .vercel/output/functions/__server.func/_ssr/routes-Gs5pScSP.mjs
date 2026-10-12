import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-jwEEWmOB.mjs";
import { i as signOut, r as signIn, t as authClient } from "./client-IWHfIGH2.mjs";
import { a as hasGateSessionMarker, t as GROK_PROVIDERS } from "./server-DFGDUo7c.mjs";
import { a as StatusPill, i as Panel, n as Button, o as cn, r as LoginScreen, s as fieldClass, t as AmazonMark } from "./login-screen-ul2O_Xcq.mjs";
import { a as Search, c as LayoutDashboard, d as EyeOff, i as Settings, l as Funnel, n as Users, o as RefreshCw, s as Receipt, t as X, u as Eye } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Gs5pScSP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function orderTotal(order) {
	return order.items.reduce((sum, item) => sum + item.qty * item.priceCents, 0);
}
function money(cents) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(cents / 100);
}
function formatWhen(iso) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	}).format(new Date(iso));
}
function relativeTime(iso) {
	if (!iso) return "Not synced";
	const delta = Math.max(0, Date.now() - Date.parse(iso));
	const minutes = Math.round(delta / 6e4);
	if (minutes < 2) return "Just now";
	if (minutes < 60) return `${minutes} minutes ago`;
	const hours = Math.round(minutes / 60);
	if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
	const days = Math.round(hours / 24);
	if (days < 30) return days === 1 ? "1 day ago" : `${days} days ago`;
	const months = Math.round(days / 30);
	return months === 1 ? "1 month ago" : `${months} months ago`;
}
function summarize(orders) {
	const counts = {
		pending: 0,
		shipped: 0,
		delivered: 0,
		cancelled: 0
	};
	let spentCents = 0;
	let pendingCents = 0;
	const products = /* @__PURE__ */ new Map();
	for (const order of orders) {
		counts[order.status] += 1;
		const total = orderTotal(order);
		if (order.status !== "cancelled") spentCents += total;
		if (order.status === "pending") pendingCents += total;
		for (const item of order.items) {
			const current = products.get(item.name) ?? {
				name: item.name,
				qty: 0,
				spentCents: 0
			};
			current.qty += item.qty;
			current.spentCents += item.qty * item.priceCents;
			products.set(item.name, current);
		}
	}
	const billable = orders.length - counts.cancelled;
	const latest = [...orders].sort((a, b) => a.placedAt < b.placedAt ? 1 : -1).slice(0, 6);
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
		topProducts
	};
}
var PAGE = 6;
function Accounts({ accounts, onSync, onAutoSync, onRemove, onAdd }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [autoOnly, setAutoOnly] = (0, import_react.useState)(false);
	const [page, setPage] = (0, import_react.useState)(0);
	const [manageId, setManageId] = (0, import_react.useState)(null);
	const [syncingId, setSyncingId] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return accounts.filter((account) => {
			if (autoOnly && !account.autoSync) return false;
			if (!q) return true;
			return account.email.includes(q) || account.host.includes(q);
		});
	}, [
		accounts,
		query,
		autoOnly
	]);
	const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
	const safePage = Math.min(page, pages - 1);
	const slice = filtered.slice(safePage * PAGE, safePage * PAGE + PAGE);
	const managing = accounts.find((account) => account.id === manageId) ?? null;
	function sync(id) {
		setSyncingId(id);
		window.setTimeout(() => {
			onSync(id);
			setSyncingId(null);
		}, 700);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-surface",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 border-b border-line px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl text-fg",
					children: "Accounts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-pressed": autoOnly,
						className: "inline-flex h-11 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-fg hover:bg-surface-2",
						onClick: () => {
							setAutoOnly((value) => !value);
							setPage(0);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4" }), autoOnly ? "Auto sync on" : "Filter"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: onAdd,
						children: "Add Account"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 py-4 md:px-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "relative block max-w-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Search accounts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: `${fieldClass} pl-9`,
							placeholder: "Search accounts",
							value: query,
							onChange: (event) => {
								setQuery(event.target.value);
								setPage(0);
							}
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden grid-cols-[1.3fr_1.4fr_0.9fr_0.8fr_auto] gap-3 border-y border-line px-5 py-2 text-xs font-semibold tracking-wide text-muted uppercase md:grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Retailer" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Account" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last sync" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Auto sync" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "Actions"
					})
				]
			}),
			slice.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-5 py-10 text-sm text-muted",
				children: "No accounts yet. Add an Amazon account to start a sync."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: slice.map((account) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col gap-3 px-4 py-4 md:grid md:grid-cols-[1.3fr_1.4fr_0.9fr_0.8fr_auto] md:items-center md:gap-3 md:px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmazonMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-fg",
								children: "Amazon"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: account.host
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-9 w-9 place-items-center rounded-full bg-accent/10 text-sm font-semibold text-accent",
								children: account.email.charAt(0).toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-fg",
									children: account.email
								}), account.syncError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-fg",
									children: account.syncError
								}) : null]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							suppressHydrationWarning: true,
							children: relativeTime(account.lastSyncAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-sm font-semibold ${account.autoSync ? "text-accent" : "text-muted"}`,
							children: account.autoSync ? "Enabled" : "Off"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 md:justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 rounded-lg border border-line px-3 text-sm font-semibold text-accent hover:bg-surface-2",
								onClick: () => setManageId(account.id),
								children: "Manage"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "primary",
								onClick: () => sync(account.id),
								disabled: syncingId === account.id,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${syncingId === account.id ? "animate-spin" : ""}` }), syncingId === account.id ? "Syncing" : "Sync"]
							})]
						})
					]
				}, account.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-t border-line px-4 py-3 text-sm text-muted md:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: filtered.length === 0 ? "Showing 0" : `Showing ${safePage * PAGE + 1}–${Math.min(filtered.length, safePage * PAGE + slice.length)} of ${filtered.length}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 px-2 disabled:opacity-40",
							disabled: safePage === 0,
							onClick: () => setPage(safePage - 1),
							children: "Prev"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-md bg-accent text-sm font-semibold text-accent-ink",
							children: safePage + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 px-2 disabled:opacity-40",
							disabled: safePage >= pages - 1,
							onClick: () => setPage(safePage + 1),
							children: "Next"
						})
					]
				})]
			}),
			managing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManageDialog, {
				account: managing,
				onClose: () => setManageId(null),
				onAutoSync,
				onRemove: () => {
					onRemove(managing.id);
					setManageId(null);
				}
			}) : null
		]
	});
}
function ManageDialog({ account, onClose, onAutoSync, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 grid place-items-center bg-fg/40 p-4",
		role: "presentation",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "manage-title",
			className: "w-full max-w-md rounded-xl bg-surface p-5 shadow-xl",
			onClick: (event) => event.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "manage-title",
						className: "font-display text-2xl text-fg",
						children: "Manage account"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid h-11 w-11 place-items-center rounded-lg hover:bg-surface-2",
						onClick: onClose,
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-fg",
					children: account.email
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: ["Amazon · ", account.host]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-5 flex items-center justify-between gap-3 text-sm font-semibold",
					children: ["Auto sync", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "h-5 w-5 accent-accent",
						checked: account.autoSync,
						onChange: (event) => onAutoSync(account.id, event.target.checked)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 rounded-lg px-3 text-sm font-semibold text-fg hover:bg-surface-2",
						onClick: onRemove,
						children: "Remove account"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: onClose,
						children: "Done"
					})]
				})
			]
		})
	});
}
var STEPS = [
	{
		n: 1,
		title: "Select a Retailer",
		hint: "Choose a store"
	},
	{
		n: 2,
		title: "Sign In",
		hint: "Login to your account"
	},
	{
		n: 3,
		title: "Authorize Account",
		hint: "Confirm account access"
	},
	{
		n: 4,
		title: "Completed",
		hint: "Your account has been linked"
	}
];
function AddAccountWizard({ open, onClose, onLinked }) {
	const [step, setStep] = (0, import_react.useState)(1);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [agreed, setAgreed] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
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
	function login(event) {
		event.preventDefault();
		if (!email.includes("@") || password.length < 6 || !agreed) {
			setError("Enter the Amazon email, a password of at least 6 characters, and accept the terms.");
			return;
		}
		setPassword("");
		setError("");
		setStep(3);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 grid place-items-center bg-fg/40 p-3",
		role: "presentation",
		onClick: resetAndClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "add-account-title",
			className: "max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface shadow-xl",
			onClick: (event) => event.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-line px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "add-account-title",
					className: "text-base font-semibold text-fg",
					children: "Add New Account"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid h-11 w-11 place-items-center rounded-lg hover:bg-surface-2",
					"aria-label": "Close",
					onClick: resetAndClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 px-5 py-6 md:grid-cols-[14rem_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "flex gap-4 overflow-x-auto md:flex-col md:gap-0",
					children: STEPS.map((item, index) => {
						const active = step === item.n;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex min-w-40 gap-3 md:min-w-0 md:pb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `grid h-8 w-8 place-items-center rounded-lg text-sm font-semibold ${active ? "bg-accent text-accent-ink" : "bg-accent/10 text-accent"}`,
									children: item.n
								}), index < STEPS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 hidden h-full w-px bg-line md:block" }) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-sm font-semibold ${active ? "text-fg" : "text-muted"}`,
									children: item.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: item.hint
								})]
							})]
						}, item.n);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl text-fg",
							children: "Choose Retailer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Select the retailer you want to connect your account with."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 w-full max-w-xs rounded-xl border border-accent bg-accent/5 p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmazonMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-fg",
									children: "Amazon"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "www.amazon.com"
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted",
							children: "Other retailers are planned. Amazon is the only one that can be linked today."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "primary",
								onClick: () => setStep(2),
								children: "Continue"
							})
						})
					] }) : null,
					step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: login,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl text-fg",
								children: "Amazon Account Info"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Please enter your Amazon email and password to connect your account."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Password is not saved."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-4 block text-sm font-semibold text-fg",
								children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: `${fieldClass} mt-1`,
									type: "email",
									autoComplete: "username",
									placeholder: "Email",
									value: email,
									onChange: (event) => setEmail(event.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 block text-sm font-semibold text-fg",
								children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative mt-1 block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: `${fieldClass} pr-12`,
										type: showPassword ? "text" : "password",
										autoComplete: "current-password",
										placeholder: "Password",
										value: password,
										onChange: (event) => setPassword(event.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "absolute top-1/2 right-1 grid h-10 w-10 -translate-y-1/2 place-items-center text-muted",
										"aria-label": showPassword ? "Hide password" : "Show password",
										onClick: () => setShowPassword((value) => !value),
										children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-4 flex items-start gap-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "mt-1 h-4 w-4 accent-accent",
									checked: agreed,
									onChange: (event) => setAgreed(event.target.checked)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "By clicking Login, I agree that I have read and accepted the terms of this link." })]
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-semibold text-fg",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "primary",
									type: "submit",
									children: "Login"
								})
							})
						]
					}) : null,
					step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl text-fg",
							children: "Authorize Account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Confirm Folio can read orders, shipments, and item totals for this account."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 rounded-xl border border-line p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-fg",
								children: email
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Amazon · www.amazon.com"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setStep(2),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "primary",
								onClick: () => setStep(4),
								children: "Authorize"
							})]
						})
					] }) : null,
					step === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl text-fg",
							children: "Account added"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [email, " is linked. It has no orders until a sync returns them."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "primary",
								onClick: () => {
									onLinked(email);
									resetAndClose();
								},
								children: "Done"
							})
						})
					] }) : null
				] })]
			})]
		})
	});
}
function Dashboard({ orders, accounts, onOpenOrders }) {
	const summary = summarize(orders);
	const emailFor = (id) => accounts.find((account) => account.id === id)?.email ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Total orders",
						value: String(summary.total),
						hint: "Every status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Shipped",
						value: String(summary.shipped),
						hint: "In transit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Delivered",
						value: String(summary.delivered),
						hint: "Received"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Pending",
						value: String(summary.pending),
						hint: "Not shipped yet"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Total spent",
						value: money(summary.spentCents),
						hint: "Excludes cancelled"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Average order",
						value: money(summary.averageCents),
						hint: "Across billed orders"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Pending value",
						value: money(summary.pendingCents),
						hint: "Still open"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Latest orders",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm font-semibold text-accent",
						onClick: onOpenOrders,
						children: "View all"
					}),
					children: summary.latest.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No orders for this account yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-line",
						children: summary.latest.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold text-fg",
									children: order.items[0]?.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 truncate text-xs text-muted",
									children: [
										formatWhen(order.placedAt),
										" · ",
										emailFor(order.accountId),
										order.items.length > 1 ? ` · +${order.items.length - 1} more` : ""
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 flex-col items-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold tabular-nums",
									children: money(orderTotal(order))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: order.status })]
							})]
						}, order.id))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Top products",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "By quantity"
					}),
					children: summary.topProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Products show up after a sync."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "flex flex-col gap-3",
						children: summary.topProducts.map((product, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-semibold text-muted",
									children: index + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold text-fg",
										children: product.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: money(product.spentCents)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num text-lg text-fg",
									children: product.qty
								})
							]
						}, product.name))
					})
				})]
			})
		]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-surface px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-wide text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "num mt-2 text-3xl text-fg",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: hint
			})
		]
	});
}
var FILTERS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "pending",
		label: "Pending"
	},
	{
		id: "shipped",
		label: "Shipped"
	},
	{
		id: "delivered",
		label: "Delivered"
	},
	{
		id: "cancelled",
		label: "Cancelled"
	}
];
function Orders({ orders, accounts }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const emailFor = (id) => accounts.find((account) => account.id === id)?.email ?? "";
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return orders.filter((order) => {
			if (status !== "all" && order.status !== status) return false;
			if (!q) return true;
			return `${order.id} ${emailFor(order.accountId)} ${order.items.map((item) => item.name).join(" ")}`.toLowerCase().includes(q);
		});
	}, [
		orders,
		query,
		status,
		accounts
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 md:flex-row md:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "relative min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Search orders"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: `${fieldClass} pl-9`,
							value: query,
							placeholder: "Search orders, products, accounts",
							onChange: (event) => setQuery(event.target.value)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 overflow-x-auto",
					role: "tablist",
					"aria-label": "Order status",
					children: FILTERS.map((filter) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": status === filter.id,
						className: `h-11 shrink-0 rounded-lg px-3 text-sm font-semibold ${status === filter.id ? "bg-accent text-accent-ink" : "bg-surface text-fg"}`,
						onClick: () => setStatus(filter.id),
						children: filter.label
					}, filter.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					visible.length,
					" ",
					visible.length === 1 ? "order" : "orders"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border border-line bg-surface",
				children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-8 text-sm text-muted",
					children: "Nothing matches that search."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-line",
					children: visible.map((order) => {
						const open = openId === order.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-surface-2",
							"aria-expanded": open,
							onClick: () => setOpenId(open ? null : order.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold text-fg",
									children: order.items[0]?.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 truncate text-xs text-muted",
									children: [
										order.id,
										" · ",
										formatWhen(order.placedAt),
										" · ",
										emailFor(order.accountId)
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 flex-col items-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold tabular-nums",
									children: money(orderTotal(order))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: order.status })]
							})]
						}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "border-t border-line bg-bg/60 px-4 py-2",
							children: order.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 truncate text-fg",
									children: [item.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted",
										children: [" × ", item.qty]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 tabular-nums",
									children: money(item.qty * item.priceCents)
								})]
							}, item.name))
						}) : null] }, order.id);
					})
				})
			})
		]
	});
}
function Settings$1({ accountCount, onClear }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex max-w-2xl flex-col gap-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "Linked accounts",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: accountCount === 0 ? "No Amazon accounts are linked." : `${accountCount} Amazon ${accountCount === 1 ? "account is" : "accounts are"} linked. Removing them deletes their orders from this browser.`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-4 h-11 rounded-lg border border-line px-4 text-sm font-semibold text-fg hover:bg-surface-2",
				onClick: onClear,
				children: "Remove all accounts"
			})]
		})
	});
}
function resolveSignInGateState(input) {
	if (input.isPending) return "pending";
	return input.hasUser ? "signed_in" : "signed_out";
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
function SignInGate({ children, fallback }) {
	const { user, isPending } = useCurrentUserState();
	const state = resolveSignInGateState({
		isPending,
		hasUser: user !== null
	});
	if (state === "pending") return null;
	if (state === "signed_in") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: fallback ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInButtons, {}) });
}
function SignInButtons() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex w-full max-w-sm flex-col gap-2",
		children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => signIn(p.providerId, { callbackURL: "/" }),
			className: "w-full cursor-pointer rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900",
			children: ["Continue with ", p.label]
		}, p.providerId))
	});
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var loadLedger = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("13c3e3c4ee97861eb7711e85bde14c923a14c0849f259bf1267b91c7092d94bf"));
var linkAmazonAccount = createServerFn({ method: "POST" }).validator((email) => {
	const cleaned = email.trim().toLowerCase();
	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleaned) || cleaned.length > 200) throw new Error("Enter the Amazon email.");
	return cleaned;
}).middleware([authMiddleware]).handler(createSsrRpc("3568e796e41cb27491ad52a54ddba4f5cd39ccc63cb3881032cf73184a9b8e28"));
var setAccountAutoSync = createServerFn({ method: "POST" }).validator((input) => {
	if (!input.id || typeof input.autoSync !== "boolean") throw new Error("Invalid account.");
	return input;
}).middleware([authMiddleware]).handler(createSsrRpc("70773cb8550d507a92dc63790ce0b4c7aff9318d247a3f350ae30426db10ee9b"));
var syncAmazonAccount = createServerFn({ method: "POST" }).validator((id) => {
	if (!id) throw new Error("Invalid account.");
	return id;
}).middleware([authMiddleware]).handler(createSsrRpc("4e0fa0c65acf8b8d6ec83fa38e2eb634280490c54187e8953e8bbb6aa8428644"));
var removeAmazonAccount = createServerFn({ method: "POST" }).validator((id) => {
	if (!id) throw new Error("Invalid account.");
	return id;
}).middleware([authMiddleware]).handler(createSsrRpc("54780a91376b66897a816a429e2a86c4b26cc77110eacd62f87b19e2a00251c4"));
var clearLedger = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("a2476a5097d09d705747546587c9f82114ff9a5d9768c7f4336797b809cfbc7c"));
function apply(set, get, data) {
	const active = get().activeAccountId;
	const stillThere = active === "all" || data.accounts.some((account) => account.id === active);
	set({
		ready: true,
		accounts: data.accounts,
		orders: data.orders,
		activeAccountId: stillThere ? active : "all",
		wizardOpen: false
	});
}
var useLedger = create((set, get) => ({
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
			activeAccountId: stillThere ? active : "all"
		});
	},
	setActiveAccount: (id) => set({ activeAccountId: id }),
	openWizard: () => set({ wizardOpen: true }),
	closeWizard: () => set({ wizardOpen: false }),
	linkAccount: async (email) => {
		apply(set, get, await linkAmazonAccount({ data: email }));
	},
	setAutoSync: async (id, autoSync) => {
		apply(set, get, await setAccountAutoSync({ data: {
			id,
			autoSync
		} }));
	},
	syncAccount: async (id) => {
		apply(set, get, await syncAmazonAccount({ data: id }));
	},
	removeAccount: async (id) => {
		apply(set, get, await removeAmazonAccount({ data: id }));
	},
	clearAll: async () => {
		apply(set, get, await clearLedger());
	}
}));
function ordersForAccount(orders, activeAccountId) {
	if (activeAccountId === "all") return orders;
	return orders.filter((order) => order.accountId === activeAccountId);
}
var VIEWS = [
	{
		id: "dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		id: "orders",
		label: "Orders",
		icon: Receipt
	},
	{
		id: "accounts",
		label: "Accounts",
		icon: Users
	},
	{
		id: "settings",
		label: "Settings",
		icon: Settings
	}
];
function FolioApp() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInGate, {
			fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginScreen, {}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workspace, {})
		})
	});
}
function Workspace() {
	const [view, setView] = (0, import_react.useState)("dashboard");
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
	(0, import_react.useEffect)(() => {
		if (!user) return;
		load();
	}, [user?.id, load]);
	const visibleOrders = ordersForAccount(orders, activeAccountId);
	const active = accounts.find((account) => account.id === activeAccountId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "sticky top-0 z-20 flex items-center border-b border-line bg-surface px-4 py-3 lg:h-screen lg:flex-col lg:items-stretch lg:border-r lg:border-b-0 lg:px-4 lg:py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl tracking-tight text-accent",
						children: "folio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-8 hidden flex-1 flex-col gap-1 lg:flex",
						"aria-label": "Sections",
						children: VIEWS.map((item) => {
							const Icon = item.icon;
							const on = view === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: cn("inline-flex h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold", on ? "bg-accent/10 text-accent" : "text-fg hover:bg-surface-2"),
								"aria-current": on ? "page" : void 0,
								onClick: () => setView(item.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), item.label]
							}, item.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex flex-col gap-3 border-b border-line bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-w-0 items-center gap-2 text-sm",
							children: [
								active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmazonMark, { className: "h-8 w-8 text-sm" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-xs font-semibold",
									children: "All"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Select account"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: `${fieldClass} max-w-xs`,
									value: activeAccountId,
									onChange: (event) => setActiveAccount(event.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "All accounts"
									}), accounts.map((account) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: account.id,
										children: account.email
									}, account.id))]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "px-4 py-5 pb-24 md:px-6 md:py-6 lg:pb-6",
						children: [
							!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Loading accounts…"
							}) : null,
							ready && view === "dashboard" ? accounts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { onAdd: openWizard }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {
								orders: visibleOrders,
								accounts,
								onOpenOrders: () => setView("orders")
							}) : null,
							ready && view === "orders" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Orders, {
								orders: visibleOrders,
								accounts
							}) : null,
							ready && view === "accounts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accounts, {
								accounts,
								onSync: syncAccount,
								onAutoSync: setAutoSync,
								onRemove: removeAccount,
								onAdd: openWizard
							}) : null,
							ready && view === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings$1, {
								accountCount: accounts.length,
								onClear: clearAll
							}) : null
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddAccountWizard, {
				open: wizardOpen,
				onClose: closeWizard,
				onLinked: linkAccount
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-surface lg:hidden",
				"aria-label": "Mobile sections",
				children: VIEWS.map((item) => {
					const Icon = item.icon;
					const on = view === item.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn("flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold", on ? "text-accent" : "text-muted"),
						"aria-current": on ? "page" : void 0,
						onClick: () => setView(item.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), item.label]
					}, item.id);
				})
			})
		]
	});
}
function Empty({ onAdd }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-surface px-6 py-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-fg",
				children: "No accounts linked"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-sm text-muted",
				children: "This workspace has no linked accounts and no orders."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-6 h-11 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink",
				onClick: onAdd,
				children: "Add Account"
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolioApp, {});
}
//#endregion
export { Home as component };
