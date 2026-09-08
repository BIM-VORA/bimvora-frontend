import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How BIMVORA collects and uses account and order data.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl">Privacy policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Last updated 30 August 2026.</p>
        <p>
          We collect the email and profile details you provide at registration,
          plus order records once payments are enabled. Authentication is handled
          by Supabase Auth.
        </p>
        <p>
          We do not sell personal data. Payment card details, when a provider is
          connected, will be processed by that provider — not stored on BIMVORA
          servers.
        </p>
        <p>
          You may request access or deletion of your account data by contacting
          us. Analytics run only if a Google Analytics measurement ID is configured.
        </p>
      </div>
    </article>
  );
}
