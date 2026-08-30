"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cartCount, useCartStore } from "@/lib/cart/store";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/catalog";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const lines = useCartStore((s) => s.lines);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  const count = hydrated ? cartCount(lines) : 0;
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/95 backdrop-blur-sm">
      <div className="border-b border-border/70 bg-ink text-paper">
        <div className="mx-auto flex h-8 max-w-6xl items-center justify-between px-4 text-[11px] tracking-wide">
          <p className="font-mono uppercase">Revit families · HVAC / MEP · EUR</p>
          <p className="hidden sm:block">Versions 2022–2026 · Loadable .rfa</p>
        </div>
      </div>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="shrink-0" aria-label="BIM Lab home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm text-muted-foreground hover:text-ink",
                pathname === item.href && "text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action="/search" className="ml-auto hidden min-w-0 flex-1 max-w-sm lg:block">
          <label className="relative block">
            <span className="sr-only">Search families</span>
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              placeholder="Search SKU, family, category…"
              className="h-9 w-full border border-border bg-card pr-3 pl-8 text-sm outline-none focus:border-ink"
            />
          </label>
        </form>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button variant="ghost" size="icon" className="lg:hidden" asChild>
            <Link href="/search" aria-label="Search">
              <Search />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account" aria-label="Account">
              <User />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart" aria-label="Cart">
              <ShoppingCart />
              {count > 0 ? (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-copper text-[10px] text-paper">
                  {count}
                </span>
              ) : null}
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-paper">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-border py-3 text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
                <p className="mt-4 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                  Categories
                </p>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/categories/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="py-2 text-sm"
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
