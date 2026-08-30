import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact BIM Lab about Revit families, licensing or catalog requests.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl">Contact</h1>
      <p className="mt-2 text-muted-foreground">
        Catalog questions, licensing and custom family requests.
      </p>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <ContactForm />
        <div className="border border-border bg-card p-5 text-sm">
          <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Studio
          </p>
          <p className="mt-3">BIM Lab</p>
          <p className="text-muted-foreground">hello@bimlab.example</p>
          <p className="mt-4 text-muted-foreground">
            Response during business days. Do not send .rfa files to this
            address until a secure upload is available in the admin console.
          </p>
        </div>
      </div>
    </div>
  );
}
