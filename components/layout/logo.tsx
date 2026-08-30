import { SITE_NAME } from "@/lib/format";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden
        className="grid size-8 shrink-0 grid-cols-2 gap-px border border-ink bg-ink p-px"
      >
        <span className="bg-paper" />
        <span className="bg-copper" />
        <span className="bg-paper/80" />
        <span className="bg-paper" />
      </span>
      <span className="font-medium tracking-[0.14em] text-ink uppercase">
        {SITE_NAME}
      </span>
    </span>
  );
}
