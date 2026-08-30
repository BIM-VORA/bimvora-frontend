import type { Metadata } from "next";
import { CheckoutPlaceholder } from "@/components/cart/checkout-placeholder";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your BIM Lab order. Payment will be connected in a later phase.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl">Checkout</h1>
      <p className="mt-2 text-muted-foreground">
        Payment architecture is in place. No provider is charging yet.
      </p>
      <div className="mt-8">
        <CheckoutPlaceholder />
      </div>
    </div>
  );
}
