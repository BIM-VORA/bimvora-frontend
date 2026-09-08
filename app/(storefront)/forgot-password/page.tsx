import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your BIMVORA account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl">Reset password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We will email a reset link if an account exists for that address.
      </p>
      <div className="mt-8 border border-border bg-card p-6">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
