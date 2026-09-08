import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review Revit families in your BIMVORA cart.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl">Cart</h1>
      <p className="mt-2 text-muted-foreground">
        Digital goods. Quantities are for licensing seats of the same family.
      </p>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
