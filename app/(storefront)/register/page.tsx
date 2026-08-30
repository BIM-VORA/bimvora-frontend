import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a BIM Lab account to purchase and download Revit families.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl">Create account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Use a work email. You can add company details after you sign in.
      </p>
      <div className="mt-8 border border-border bg-card p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
