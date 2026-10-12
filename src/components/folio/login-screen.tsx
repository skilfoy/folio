import { useState, type FormEvent } from "react";
import { authClient, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { Button, fieldClass } from "@/components/folio/ui";

export function LoginScreen() {
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      if (mode === "up") {
        const result = await authClient.signUp.email({
          name: name.trim() || email.trim(),
          email: email.trim(),
          password,
          callbackURL: "/",
        });
        if (result.error) setError(result.error.message ?? "Could not create the account.");
      } else {
        const result = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/",
        });
        if (result.error) setError(result.error.message ?? "Could not sign in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-bg px-4 py-10 text-fg">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface p-6">
        <p className="font-display text-4xl tracking-tight text-accent">folio</p>
        <h1 className="mt-6 font-display text-3xl text-fg">{mode === "up" ? "Create your account" : "Sign in"}</h1>
        <p className="mt-2 text-sm text-muted">
          {mode === "up"
            ? "This is the Folio login for your Amazon order history. Amazon accounts are added after this."
            : "Sign in to the Folio account that holds your linked Amazon accounts and orders."}
        </p>

        <form className="mt-6 flex flex-col gap-3" onSubmit={submit}>
          {mode === "up" ? (
            <label className="text-sm font-semibold">
              Name
              <input className={`${fieldClass} mt-1`} value={name} autoComplete="name" onChange={(event) => setName(event.target.value)} />
            </label>
          ) : null}
          <label className="text-sm font-semibold">
            Email
            <input
              className={`${fieldClass} mt-1`}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="text-sm font-semibold">
            Password
            <input
              className={`${fieldClass} mt-1`}
              type="password"
              required
              minLength={8}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className="text-sm font-semibold text-fg">{error}</p> : null}
          <Button variant="primary" type="submit" disabled={pending}>
            {pending ? "Please wait" : mode === "up" ? "Create account" : "Sign in"}
          </Button>
        </form>

        <button
          type="button"
          className="mt-3 text-sm font-semibold text-accent"
          onClick={() => {
            setMode(mode === "up" ? "in" : "up");
            setError("");
          }}
        >
          {mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>

        <div className="mt-6 flex flex-col gap-2">
          {GROK_PROVIDERS.map((provider) => (
            <Button key={provider.providerId} onClick={() => signIn(provider.providerId, { callbackURL: "/" })}>
              Continue with {provider.label}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
