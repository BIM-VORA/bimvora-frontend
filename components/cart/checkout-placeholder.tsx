"use client";

import { cartSubtotal, useCartStore } from "@/lib/cart/store";
import { formatEur } from "@/lib/format";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CheckoutPlaceholder() {
  const lines = useCartStore((s) => s.lines);
  const subtotal = cartSubtotal(lines);

  if (lines.length === 0) {
    return (
      <div className="border border-border bg-card p-8">
        <p>Your cart is empty.</p>
        <Button asChild className="mt-4 rounded-none">
          <Link href="/shop">Return to shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="border border-border bg-card p-6">
        <h2 className="text-lg">Payment not connected</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          BIM Lab checkout is architected around a payment-provider interface.
          No gateway is hard-coded. When a provider is selected, this page will
          create an order and redirect to a hosted payment session.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Orders, order items and payment events already exist in the database schema.</li>
          <li>Files stay in a private storage bucket until a paid download is issued.</li>
          <li>You will not be charged on this page.</li>
        </ul>
        <Button asChild variant="outline" className="mt-6 rounded-none">
          <Link href="/cart">Back to cart</Link>
        </Button>
      </div>
      <aside className="h-fit border border-border bg-card p-5">
        <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          {lines.length} {lines.length === 1 ? "family" : "families"}
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {lines.map((line) => (
            <li key={line.productId} className="flex justify-between gap-3">
              <span className="truncate">{line.name}</span>
              <span className="font-mono">{formatEur(line.priceCents * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4">
          <span>Total</span>
          <span className="text-copper">{formatEur(subtotal)}</span>
        </div>
      </aside>
    </div>
  );
}
