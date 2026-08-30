import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund policy",
  description: "Refund rules for BIM Lab digital Revit families.",
};

export default function RefundPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl">Refund policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Last updated 30 August 2026.</p>
        <p>
          Revit families are digital goods. Once a file has been downloaded,
          refunds are not issued except where the file is defective or does not
          match the listing (wrong category, missing version, corrupt archive).
        </p>
        <p>
          Report a defect within 14 days of purchase with the order reference
          and Revit version. We will replace the file or refund at our
          discretion if we cannot provide a working family.
        </p>
        <p>
          Change of mind, version mismatch that was stated on the product page,
          or incompatibility with third-party templates is not grounds for a
          refund.
        </p>
      </div>
    </article>
  );
}
