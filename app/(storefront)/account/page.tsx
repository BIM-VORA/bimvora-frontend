import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/lib/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl">Account</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Connect Supabase Auth to enable sign-in, profile and future order
          history. Until then, browsing and the cart work locally.
        </p>
        <Button asChild className="mt-6 rounded-none">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, company")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl">Account</h1>
      <p className="mt-2 text-muted-foreground">
        {profile?.full_name || profile?.email || user.email}
      </p>
      <ul className="mt-8 divide-y border border-border bg-card text-sm">
        <li>
          <Link href="/account/profile" className="block px-4 py-3 hover:bg-secondary">
            Profile
          </Link>
        </li>
        <li className="px-4 py-3 text-muted-foreground">
          Orders — available when checkout is connected
        </li>
        <li className="px-4 py-3 text-muted-foreground">
          Downloads — available after paid orders
        </li>
      </ul>
      <form action={signOutAction} className="mt-6">
        <Button type="submit" variant="outline" className="rounded-none">
          Sign out
        </Button>
      </form>
    </div>
  );
}
