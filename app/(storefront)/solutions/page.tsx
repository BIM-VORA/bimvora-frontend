"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Button } from "@/components/ui/button";

export default function SolutionsPage() {
  const { dict } = useI18n();

  // Smooth-scroll to the anchor when a hash is present.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const items = dict.solutions.items;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
        {dict.solutions.menuTitle}
      </p>
      <h1 className="mt-1 text-3xl">
        Solutions for BIM content owners
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        A complete workflow to digitize, publish, promote and measure your BIM
        content across the specification chain.
      </p>

      <nav className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`#${item.slug}`}
            className="border border-border bg-card px-4 py-3 text-sm hover:border-ink"
          >
            <span className="font-medium text-ink">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-14 space-y-16">
        {items.map((item, i) => (
          <section
            key={item.slug}
            id={item.slug}
            className="scroll-mt-24 border-t border-border pt-8"
          >
            <p className="font-mono text-[11px] tracking-wider text-copper uppercase">
              {String(i + 1).padStart(2, "0")} · {dict.solutions.menuTitle}
            </p>
            <h2 className="mt-2 text-2xl">{item.title}</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {item.summary}
            </p>
            <Button asChild variant="outline" className="mt-6 ">
              <Link href="/contact">Talk to us</Link>
            </Button>
          </section>
        ))}
      </div>
    </div>
  );
}
