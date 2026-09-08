"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart/store";
import type { Product } from "@/types/catalog";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  return (
    <Button
      className="h-11 w-full "
      onClick={() => {
        addItem(product);
        setAdded(true);
        toast.success(`${product.name} added to cart`);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? "Added" : "Add to cart"}
    </Button>
  );
}
