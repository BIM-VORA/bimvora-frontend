import type { Metadata } from "next";

function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl">{title}</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </article>
  );
}

export const metadata: Metadata = {
  title: "Terms of sale",
  description: "Terms governing purchase and use of BIM Lab Revit families.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of sale">
      <p>Last updated 30 August 2026.</p>
      <p>
        These terms govern the purchase of digital Revit families from BIM Lab.
        By creating an account or placing an order you agree to them.
      </p>
      <h2 className="text-ink">Licence</h2>
      <p>
        A standard licence grants your organisation the right to load purchased
        families into Revit projects you deliver. You may not resell, share
        publicly, or include the source .rfa in a competing catalog.
      </p>
      <h2 className="text-ink">Delivery</h2>
      <p>
        Files are digital. When payments are enabled, downloads will be issued
        to the purchasing account. You are responsible for matching Revit version
        to the listing.
      </p>
      <h2 className="text-ink">Autodesk</h2>
      <p>
        BIM Lab is not affiliated with Autodesk. Revit is a trademark of
        Autodesk, Inc.
      </p>
    </LegalLayout>
  );
}
