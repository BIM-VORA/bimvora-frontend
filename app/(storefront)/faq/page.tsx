import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about BIMVORA Revit families, versions and licensing.",
};

const FAQS = [
  {
    q: "Which Revit versions do you support?",
    a: "Each listing lists supported years (typically 2022–2026). Save-down is not guaranteed unless the listing says so.",
  },
  {
    q: "What file format do I receive?",
    a: "Loadable families are delivered as .rfa. Nested types are included inside the parent family unless noted.",
  },
  {
    q: "Can I use a family on multiple projects?",
    a: "A standard license is for one organisation. Redistribution or resale is not permitted. See Terms.",
  },
  {
    q: "When can I download after purchase?",
    a: "Downloads will be issued to your account after a paid order. Payment and signed URLs are scheduled for the next phase.",
  },
  {
    q: "Do you offer refunds on digital files?",
    a: "Because files are digital, refunds are limited. See the refund policy. Defective files are replaced.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl">FAQ</h1>
      <dl className="mt-8 space-y-8">
        {FAQS.map((item) => (
          <div key={item.q} className="border-t border-border pt-4">
            <dt className="text-lg">{item.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
