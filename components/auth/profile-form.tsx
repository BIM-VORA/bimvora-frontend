"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { updateProfileAction, type AuthState } from "@/lib/auth/actions";

export function ProfileForm({
  email,
  fullName,
  company,
}: {
  email: string;
  fullName: string;
  company: string;
}) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    updateProfileAction,
    {},
  );

  return (
    <form action={action} className="max-w-md space-y-4">
      <label className="grid gap-1 text-sm">
        Email
        <input
          value={email}
          disabled
          className="h-10 border border-border bg-muted px-3 text-muted-foreground"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Full name
        <input
          name="fullName"
          defaultValue={fullName}
          className="h-10 border border-border bg-background px-3 outline-none focus:border-ink"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Company
        <input
          name="company"
          defaultValue={company}
          className="h-10 border border-border bg-background px-3 outline-none focus:border-ink"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-ink">{state.success}</p>
      ) : null}
      <Button type="submit" className="" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
