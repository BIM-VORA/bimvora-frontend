"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [pending, setPending] = useState(false);

  return (
    <form
      className="max-w-lg space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setPending(true);
        window.setTimeout(() => {
          setPending(false);
          toast.success("Message received. We will reply by email.");
          (e.target as HTMLFormElement).reset();
        }, 400);
      }}
    >
      <label className="grid gap-1 text-sm">
        Name
        <input required name="name" className="h-10 border border-border bg-background px-3 outline-none focus:border-ink" />
      </label>
      <label className="grid gap-1 text-sm">
        Email
        <input required type="email" name="email" className="h-10 border border-border bg-background px-3 outline-none focus:border-ink" />
      </label>
      <label className="grid gap-1 text-sm">
        Message
        <textarea required name="message" rows={5} className="border border-border bg-background px-3 py-2 outline-none focus:border-ink" />
      </label>
      <Button type="submit" className="rounded-none" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Transactional email is not wired yet. This form confirms locally so the
        storefront can be reviewed.
      </p>
    </form>
  );
}
