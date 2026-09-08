"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { StudentVerificationForm } from "@/components/packs/student-verification-form";

const HASH = "#student-verification";

export function StudentVerificationSection() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === HASH);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => {
        document
          .getElementById("student-verification")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const close = () => {
    if (typeof window !== "undefined") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <section
      id="student-verification"
      className="scroll-mt-28 border-y border-border bg-secondary/40"
    >
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[0.75fr_1.25fr]">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute end-4 top-4 grid size-9 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" />
        </button>
        <div>
          <p className="font-mono text-[11px] tracking-wider text-primary uppercase">
            Pack 1 · Student
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Verify your student status
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Upload proof of current enrolment to request free access to
            essential families, training projects and BIM templates.
            Applications remain pending until reviewed.
          </p>
        </div>
        <StudentVerificationForm />
      </div>
    </section>
  );
}
