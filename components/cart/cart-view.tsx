"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  cartCount,
  cartSubtotal,
  useCartStore,
} from "@/lib/cart/store";
import { formatEur } from "@/lib/format";

export function CartView({ checkoutEnabled = false }: { checkoutEnabled?: boolean }) {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = cartSubtotal(lines);
  const count = cartCount(lines);

  if (count === 0) {
    return (
      <div className="border border-border bg-card p-10 text-center">
        <p className="text-lg">Your cart is empty.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse the catalog and add Revit families before checkout.
        </p>
        <Button asChild className="mt-6 rounded-none">
          <Link href="/shop">Open shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y border border-border bg-card">
        {lines.map((line) => (
          <li key={line.productId} className="flex gap-4 p-4">
            <Link href={`/products/${line.slug}`} className="size-20 shrink-0 border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={line.imageUrl} alt="" className="h-full w-full object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/products/${line.slug}`} className="font-medium hover:text-copper">
                {line.name}
              </Link>
              <p className="font-mono text-[11px] text-muted-foreground">{line.sku}</p>
              <p className="mt-1 text-sm text-copper">{formatEur(line.priceCents)}</p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-none"
                  onClick={() => setQuantity(line.productId, line.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus />
                </Button>
                <span className="w-6 text-center font-mono text-sm">{line.quantity}</span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-none"
                  onClick={() => setQuantity(line.productId, line.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeItem(line.productId)}
                  aria-label="Remove"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit border border-border bg-card p-5">
        <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          Order summary
        </p>
        <div className="mt-4 flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatEur(subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">VAT calculated at checkout when payments go live.</p>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-base">
          <span>Total</span>
          <span className="text-copper">{formatEur(subtotal)}</span>
        </div>
        {checkoutEnabled ? (
          <Button asChild className="mt-6 w-full rounded-none">
            <Link href="/checkout">Continue to checkout</Link>
          </Button>
        ) : (
          <div className="mt-6 space-y-3">
            <Button asChild className="w-full rounded-none">
              <Link href="/checkout">Continue to checkout</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Payment is not connected yet. You can review checkout, but no charge will be made.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
