import type { Metadata } from "next";
import { CheckoutPlaceholder } from "@/components/cart/checkout-placeholder";
import { getDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your BIMVORA order. Secure billing and payment.",
};

export default async function CheckoutPage() {
  const { dict } = await getDictionary();
  const t = dict.checkout;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="font-mono text-[11px] font-medium tracking-wider text-primary uppercase">
          {t.pageStepLabel}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{t.pageTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.pageLead}</p>
      </div>
      <CheckoutPlaceholder />
    </div>
  );
}
