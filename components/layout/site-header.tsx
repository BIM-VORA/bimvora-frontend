"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/layout/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/i18n-provider";
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

type NavItem = {
  href: string;
  key: "home" | "shop" | "bimObjects" | "packs" | "bimSolution" | "bimProject" | "about" | "faq" | "contact";
  exact?: boolean;
};

const NAV: readonly NavItem[] = [
  { href: "/", key: "home", exact: true },
  { href: "/shop", key: "shop" },
  { href: "/bim-objects", key: "bimObjects" },
  { href: "/packs", key: "packs" },
  { href: "/bim-solution", key: "bimSolution" },
  { href: "/bim-project", key: "bimProject" },
  { href: "/about", key: "about" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
];

function isNavActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const { dict } = useI18n();
  const departments = categories.filter((category) => !category.parentId);
  const lines = useCartStore((s) => s.lines);
  const hydrated = useSyncExternalStore(
    (onStoreChange) => useCartStore.persist.onFinishHydration(onStoreChange),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
  const count = hydrated ? cartCount(lines) : 0;
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="shrink-0" aria-label={dict.header.home}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const isActive = isNavActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-all rounded-md",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {dict.nav[item.key]}
              </Link>
            );
          })}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search" aria-label={dict.header.search}>
              <Search />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account" aria-label={dict.header.account}>
              <User />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart" aria-label={dict.header.cart}>
              <ShoppingCart />
              {count > 0 ? (
                <span className="absolute top-1 end-1 flex size-4 items-center justify-center rounded-full bg-copper text-[10px] text-paper">
                  {count}
                </span>
              ) : null}
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={dict.header.menu}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-paper">
              <SheetHeader>
                <SheetTitle>{dict.header.menu}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV.map((item) => {
                  const isActive = isNavActive(pathname, item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "rounded-md px-3 py-3 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      {dict.nav[item.key]}
                    </Link>
                  );
                })}
                <p className="mt-4 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                  {dict.header.categories}
                </p>
                {departments.map((c) => (
                  <Link
                    key={c.id}
                    href={`/categories/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="py-2 text-sm"
                  >
                    {c.name}
                  </Link>
                ))}
                <div className="mt-4 border-t border-border pt-4">
                  <LanguageSwitcher variant="inline" />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
