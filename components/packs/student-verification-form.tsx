"use client";

import { useState, useSyncExternalStore } from "react";
import { CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type PendingApplication = {
  fullName: string;
  email: string;
  institution: string;
  filename: string;
  submittedAt: string;
};

const STORAGE_KEY = "bim-lab-student-verification";
const STORAGE_EVENT = "bim-lab-student-verification-change";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function StudentVerificationForm() {
  const savedApplication = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener(STORAGE_EVENT, onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(STORAGE_EVENT, onStoreChange);
      };
    },
    () => window.localStorage.getItem(STORAGE_KEY),
    () => null,
  );
  const application = savedApplication
    ? (JSON.parse(savedApplication) as PendingApplication)
    : null;
  const [error, setError] = useState("");

  if (application) {
    return (
      <div className="border border-copper bg-card p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-copper" />
          <div>
            <p className="font-medium">Student verification pending</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We recorded your application for {application.email}. Your
              certificate <span className="font-mono">{application.filename}</span>{" "}
              is queued for review.
            </p>
            <p className="mt-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              Submitted{" "}
              {new Date(application.submittedAt).toLocaleDateString("en-GB")}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 "
              onClick={() => {
                window.localStorage.removeItem(STORAGE_KEY);
                window.dispatchEvent(new Event(STORAGE_EVENT));
              }}
            >
              Submit a different certificate
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4 border border-border bg-card p-6 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const form = event.currentTarget;
        const data = new FormData(form);
        const certificate = data.get("certificate");

        if (!(certificate instanceof File) || certificate.size === 0) {
          setError("Add your student certificate before submitting.");
          return;
        }
        if (certificate.size > MAX_FILE_SIZE) {
          setError("The certificate must be 5 MB or smaller.");
          return;
        }

        const next: PendingApplication = {
          fullName: String(data.get("fullName") ?? ""),
          email: String(data.get("email") ?? ""),
          institution: String(data.get("institution") ?? ""),
          filename: certificate.name,
          submittedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(STORAGE_EVENT));
        form.reset();
      }}
    >
      <label className="grid gap-1 text-sm">
        Full name
        <input
          name="fullName"
          required
          autoComplete="name"
          className="h-10 border border-border bg-background px-3 outline-none focus:border-ink"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Student email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-10 border border-border bg-background px-3 outline-none focus:border-ink"
        />
      </label>
      <label className="grid gap-1 text-sm sm:col-span-2">
        University or training institution
        <input
          name="institution"
          required
          className="h-10 border border-border bg-background px-3 outline-none focus:border-ink"
        />
      </label>
      <label className="grid gap-1 text-sm sm:col-span-2">
        Student certificate
        <input
          name="certificate"
          type="file"
          required
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="min-h-11 border border-dashed border-border bg-background px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-secondary file:px-2 file:py-1"
        />
        <span className="text-xs text-muted-foreground">
          PDF, JPG or PNG · maximum 5 MB
        </span>
      </label>
      {error ? (
        <p className="text-sm text-destructive sm:col-span-2">{error}</p>
      ) : null}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <Button type="submit" className="">
          <FileCheck2 />
          Submit for review
        </Button>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-4" />
          Certificates are private and used only for eligibility review.
        </p>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2">
        Phase 1 preview: this browser records the pending status without
        uploading the document. After Supabase is connected, the same form will
        upload securely to the private student-certificates bucket.
      </p>
    </form>
  );
}
