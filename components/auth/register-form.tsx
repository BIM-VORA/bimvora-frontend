"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { registerAction, type AuthState } from "@/lib/auth/actions";

export function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    registerAction,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      <label className="grid gap-1 text-sm">
        Full name
        <input
          name="fullName"
          autoComplete="name"
          className="h-10 border border-border bg-background px-3 outline-none focus:border-ink"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-10 border border-border bg-background px-3 outline-none focus:border-ink"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="h-10 border border-border bg-background px-3 outline-none focus:border-ink"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-ink">{state.success}</p>
      ) : null}
      <Button type="submit" className="w-full rounded-none" disabled={pending}>
        {pending ? "Creating…" : "Create account"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Already registered?{" "}
        <Link href="/login" className="text-ink underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
