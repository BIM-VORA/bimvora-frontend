import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your BIM Lab account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Access orders, downloads and profile once those features are live.
      </p>
      <div className="mt-8 border border-border bg-card p-6">
        <Suspense fallback={<p className="text-sm">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
