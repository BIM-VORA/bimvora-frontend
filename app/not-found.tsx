import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start px-4 py-24">
      <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
        404
      </p>
      <h1 className="mt-2 text-3xl">Page not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        That route is not in the BIM Lab catalog.
      </p>
      <Button asChild className="mt-6 rounded-none">
        <Link href="/shop">Back to shop</Link>
      </Button>
    </div>
  );
}
