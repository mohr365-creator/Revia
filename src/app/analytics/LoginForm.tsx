"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-amber px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-saffron disabled:opacity-50"
    >
      {pending ? "Checking…" : "Enter"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useFormState(login, { error: "" });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-cream/10 bg-navy/60 p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-eyebrow text-amber">
            Revia
          </p>
          <h1 className="mt-2 font-serif text-2xl text-cream">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-cream/50">
            Enter the dashboard password to continue.
          </p>
        </div>

        <form action={action} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-eyebrow text-cream/50">
              Password
            </span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="mt-2 w-full rounded-xl border border-cream/15 bg-navy/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-amber focus:outline-none"
            />
          </label>

          {state.error && (
            <p className="text-sm text-ember">{state.error}</p>
          )}

          <Submit />
        </form>
      </div>
    </div>
  );
}
