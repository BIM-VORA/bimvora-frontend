import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/auth/profile-form";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) {
    redirect("/account");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, company")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl">Profile</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Used on invoices and download receipts later.
      </p>
      <div className="mt-8 border border-border bg-card p-6">
        <ProfileForm
          email={profile?.email || user.email || ""}
          fullName={profile?.full_name ?? ""}
          company={profile?.company ?? ""}
        />
      </div>
    </div>
  );
}
