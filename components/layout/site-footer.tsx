import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import type { Category } from "@/types/catalog";

export function SiteFooter({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-auto border-t border-border bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="[&_span]:text-paper [&_.bg-paper]:bg-paper [&_.bg-copper]:bg-copper [&_.border-ink]:border-paper/40 [&_.bg-ink]:bg-ink">
            <Logo />
          </div>
          <p className="max-w-xs text-sm text-paper/70">
            Loadable Revit families for HVAC, plumbing and fire protection —
            built for coordinated MEP models.
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-wider text-paper/50 uppercase">
            Catalog
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="text-paper/80 hover:text-paper">
                All families
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="text-paper/80 hover:text-paper"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-wider text-paper/50 uppercase">
            Company
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-paper/80 hover:text-paper">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-paper/80 hover:text-paper">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-paper/80 hover:text-paper">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-wider text-paper/50 uppercase">
            Legal
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/terms" className="text-paper/80 hover:text-paper">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-paper/80 hover:text-paper">
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/refund-policy"
                className="text-paper/80 hover:text-paper"
              >
                Refund policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-[11px] text-paper/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} BIM Lab. All rights reserved.</p>
          <p className="font-mono">Independent of Autodesk. Revit is a trademark of Autodesk, Inc.</p>
        </div>
      </div>
    </footer>
  );
}
