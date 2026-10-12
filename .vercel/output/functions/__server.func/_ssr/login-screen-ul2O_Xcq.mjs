import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-IWHfIGH2.mjs";
import { t as GROK_PROVIDERS } from "./server-DFGDUo7c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-screen-ul2O_Xcq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...parts) {
	return parts.filter(Boolean).join(" ");
}
var BUTTON = {
	primary: "bg-accent text-accent-ink hover:opacity-90",
	ghost: "border border-line bg-surface text-fg hover:bg-surface-2"
};
function Button({ variant = "ghost", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-50", BUTTON[variant], className),
		...props
	});
}
var fieldClass = "h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-fg placeholder:text-muted";
function Panel({ title, action, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-xl border border-line bg-surface p-4 md:p-5", className),
		children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg text-fg",
				children: title
			}), action]
		}) : null, children]
	});
}
function StatusPill({ status }) {
	const label = status.charAt(0).toUpperCase() + status.slice(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", status === "delivered" && "bg-accent/10 text-accent", status === "shipped" && "bg-surface-2 text-fg", status === "pending" && "bg-fg/5 text-fg", status === "cancelled" && "text-muted"),
		children: label
	});
}
function AmazonMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fg font-display text-base text-surface", className),
		"aria-hidden": true,
		children: "a"
	});
}
function LoginScreen() {
	const [mode, setMode] = (0, import_react.useState)("up");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	async function submit(event) {
		event.preventDefault();
		setError("");
		setPending(true);
		try {
			if (mode === "up") {
				const result = await authClient.signUp.email({
					name: name.trim() || email.trim(),
					email: email.trim(),
					password,
					callbackURL: "/"
				});
				if (result.error) setError(result.error.message ?? "Could not create the account.");
			} else {
				const result = await authClient.signIn.email({
					email: email.trim(),
					password,
					callbackURL: "/"
				});
				if (result.error) setError(result.error.message ?? "Could not sign in.");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not sign in.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-bg px-4 py-10 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl border border-line bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-4xl tracking-tight text-accent",
					children: "folio"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 font-display text-3xl text-fg",
					children: mode === "up" ? "Create your account" : "Sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Your workspace starts empty. Nothing is loaded until you add it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 flex flex-col gap-3",
					onSubmit: submit,
					children: [
						mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm font-semibold",
							children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: `${fieldClass} mt-1`,
								value: name,
								autoComplete: "name",
								onChange: (event) => setName(event.target.value)
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm font-semibold",
							children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: `${fieldClass} mt-1`,
								type: "email",
								required: true,
								autoComplete: "email",
								value: email,
								onChange: (event) => setEmail(event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm font-semibold",
							children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: `${fieldClass} mt-1`,
								type: "password",
								required: true,
								minLength: 8,
								autoComplete: mode === "up" ? "new-password" : "current-password",
								value: password,
								onChange: (event) => setPassword(event.target.value)
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-fg",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							type: "submit",
							disabled: pending,
							children: pending ? "Please wait" : mode === "up" ? "Create account" : "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-3 text-sm font-semibold text-accent",
					onClick: () => {
						setMode(mode === "up" ? "in" : "up");
						setError("");
					},
					children: mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => signIn(provider.providerId, { callbackURL: "/" }),
						children: ["Continue with ", provider.label]
					}, provider.providerId))
				})
			]
		})
	});
}
//#endregion
export { StatusPill as a, Panel as i, Button as n, cn as o, LoginScreen as r, fieldClass as s, AmazonMark as t };
