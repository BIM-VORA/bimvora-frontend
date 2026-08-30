"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/catalog";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  priceCents: number;
  imageUrl: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addItem: (product) => {
        const existing = get().lines.find((l) => l.productId === product.id);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.productId === product.id
                ? { ...l, quantity: l.quantity + 1 }
                : l,
            ),
          });
          return;
        }
        set({
          lines: [
            ...get().lines,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              sku: product.sku,
              priceCents: product.priceCents,
              imageUrl: product.images[0]?.url ?? "/families/vav-box.svg",
              quantity: 1,
            },
          ],
        });
      },
      removeItem: (productId) =>
        set({ lines: get().lines.filter((l) => l.productId !== productId) }),
      setQuantity: (productId, quantity) => {
        if (quantity < 1) {
          set({ lines: get().lines.filter((l) => l.productId !== productId) });
          return;
        }
        set({
          lines: get().lines.map((l) =>
            l.productId === productId ? { ...l, quantity } : l,
          ),
        });
      },
      clear: () => set({ lines: [] }),
    }),
    { name: "bim-lab-cart" },
  ),
);

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.priceCents * line.quantity, 0);
}
