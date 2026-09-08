"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Lock,
  ShieldCheck,
  CreditCard,
  X,
  ArrowLeft,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cartSubtotal, useCartStore } from "@/lib/cart/store";
import { createOrder } from "@/lib/api/orders";
import { formatEur } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { cn } from "@/lib/utils";

type CheckoutDict = Dictionary["checkout"];

const COUNTRIES = [
  { code: "MA", name: "Maroc" },
  { code: "AF", name: "Afghanistan" },
  { code: "ZA", name: "Afrique du Sud" },
  { code: "AL", name: "Albanie" },
  { code: "DZ", name: "Algérie" },
  { code: "DE", name: "Allemagne" },
  { code: "AD", name: "Andorre" },
  { code: "AO", name: "Angola" },
  { code: "AG", name: "Antigua-et-Barbuda" },
  { code: "SA", name: "Arabie saoudite" },
  { code: "AR", name: "Argentine" },
  { code: "AM", name: "Arménie" },
  { code: "AU", name: "Australie" },
  { code: "AT", name: "Autriche" },
  { code: "AZ", name: "Azerbaïdjan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahreïn" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbade" },
  { code: "BE", name: "Belgique" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Bénin" },
  { code: "BT", name: "Bhoutan" },
  { code: "BY", name: "Biélorussie" },
  { code: "BO", name: "Bolivie" },
  { code: "BA", name: "Bosnie-Herzégovine" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brésil" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgarie" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodge" },
  { code: "CM", name: "Cameroun" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cap-Vert" },
  { code: "CF", name: "Centrafrique" },
  { code: "CL", name: "Chili" },
  { code: "CN", name: "Chine" },
  { code: "CY", name: "Chypre" },
  { code: "CO", name: "Colombie" },
  { code: "KM", name: "Comores" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo (RDC)" },
  { code: "KR", name: "Corée du Sud" },
  { code: "KP", name: "Corée du Nord" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "HR", name: "Croatie" },
  { code: "CU", name: "Cuba" },
  { code: "DK", name: "Danemark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominique" },
  { code: "EG", name: "Égypte" },
  { code: "AE", name: "Émirats arabes unis" },
  { code: "EC", name: "Équateur" },
  { code: "ER", name: "Érythrée" },
  { code: "ES", name: "Espagne" },
  { code: "EE", name: "Estonie" },
  { code: "SZ", name: "Eswatini" },
  { code: "US", name: "États-Unis" },
  { code: "ET", name: "Éthiopie" },
  { code: "FJ", name: "Fidji" },
  { code: "FI", name: "Finlande" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambie" },
  { code: "GE", name: "Géorgie" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Grèce" },
  { code: "GD", name: "Grenade" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinée" },
  { code: "GQ", name: "Guinée équatoriale" },
  { code: "GW", name: "Guinée-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haïti" },
  { code: "HN", name: "Honduras" },
  { code: "HU", name: "Hongrie" },
  { code: "IN", name: "Inde" },
  { code: "ID", name: "Indonésie" },
  { code: "IQ", name: "Irak" },
  { code: "IR", name: "Iran" },
  { code: "IE", name: "Irlande" },
  { code: "IS", name: "Islande" },
  { code: "IL", name: "Israël" },
  { code: "IT", name: "Italie" },
  { code: "JM", name: "Jamaïque" },
  { code: "JP", name: "Japon" },
  { code: "JO", name: "Jordanie" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KG", name: "Kirghizistan" },
  { code: "KI", name: "Kiribati" },
  { code: "XK", name: "Kosovo" },
  { code: "KW", name: "Koweït" },
  { code: "LA", name: "Laos" },
  { code: "LS", name: "Lesotho" },
  { code: "LV", name: "Lettonie" },
  { code: "LB", name: "Liban" },
  { code: "LR", name: "Libéria" },
  { code: "LY", name: "Libye" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lituanie" },
  { code: "LU", name: "Luxembourg" },
  { code: "MK", name: "Macédoine du Nord" },
  { code: "MG", name: "Madagascar" },
  { code: "MY", name: "Malaisie" },
  { code: "MW", name: "Malawi" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malte" },
  { code: "MH", name: "Marshall (îles)" },
  { code: "MU", name: "Maurice" },
  { code: "MR", name: "Mauritanie" },
  { code: "MX", name: "Mexique" },
  { code: "FM", name: "Micronésie" },
  { code: "MD", name: "Moldavie" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolie" },
  { code: "ME", name: "Monténégro" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar (Birmanie)" },
  { code: "NA", name: "Namibie" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Népal" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigéria" },
  { code: "NO", name: "Norvège" },
  { code: "NZ", name: "Nouvelle-Zélande" },
  { code: "OM", name: "Oman" },
  { code: "UG", name: "Ouganda" },
  { code: "UZ", name: "Ouzbékistan" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palaos" },
  { code: "PS", name: "Palestine" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papouasie-Nouvelle-Guinée" },
  { code: "PY", name: "Paraguay" },
  { code: "NL", name: "Pays-Bas" },
  { code: "PE", name: "Pérou" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Pologne" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Roumanie" },
  { code: "GB", name: "Royaume-Uni" },
  { code: "RU", name: "Russie" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint-Kitts-et-Nevis" },
  { code: "SM", name: "Saint-Marin" },
  { code: "VC", name: "Saint-Vincent-et-les-Grenadines" },
  { code: "LC", name: "Sainte-Lucie" },
  { code: "SB", name: "Salomon (îles)" },
  { code: "SV", name: "Salvador" },
  { code: "WS", name: "Samoa" },
  { code: "ST", name: "Sao Tomé-et-Principe" },
  { code: "SN", name: "Sénégal" },
  { code: "RS", name: "Serbie" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapour" },
  { code: "SK", name: "Slovaquie" },
  { code: "SI", name: "Slovénie" },
  { code: "SO", name: "Somalie" },
  { code: "SD", name: "Soudan" },
  { code: "SS", name: "Soudan du Sud" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SE", name: "Suède" },
  { code: "CH", name: "Suisse" },
  { code: "SR", name: "Suriname" },
  { code: "SY", name: "Syrie" },
  { code: "TJ", name: "Tadjikistan" },
  { code: "TW", name: "Taïwan" },
  { code: "TZ", name: "Tanzanie" },
  { code: "TD", name: "Tchad" },
  { code: "CZ", name: "Tchéquie" },
  { code: "TH", name: "Thaïlande" },
  { code: "TL", name: "Timor oriental" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinité-et-Tobago" },
  { code: "TN", name: "Tunisie" },
  { code: "TM", name: "Turkménistan" },
  { code: "TR", name: "Turquie" },
  { code: "TV", name: "Tuvalu" },
  { code: "UA", name: "Ukraine" },
  { code: "UY", name: "Uruguay" },
  { code: "VU", name: "Vanuatu" },
  { code: "VA", name: "Vatican" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yémen" },
  { code: "ZM", name: "Zambie" },
  { code: "ZW", name: "Zimbabwe" },
];

type FieldProps = {
  label: string;
  required?: boolean;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function Field({ label, required, hint, children, className }: FieldProps) {
  return (
    <label className={cn("block", className)}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          {label}
          {required ? <span className="ms-1 text-destructive">*</span> : null}
        </span>
        {hint ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
    </label>
  );
}

const inputBase =
  "block w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20";

/* -------------------------------------------------------------------------- */
/*  Step indicator                                                            */
/* -------------------------------------------------------------------------- */

function Stepper({ step, t }: { step: 1 | 2; t: CheckoutDict }) {
  const steps = [
    { n: 1, label: t.stepper.address },
    { n: 2, label: t.stepper.payment },
  ] as const;
  return (
    <ol className="mx-auto mb-6 flex max-w-2xl items-center justify-center gap-3 text-xs font-medium">
      {steps.map((s, i) => {
        const done = step > s.n;
        const current = step === s.n;
        return (
          <li key={s.n} className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-7 place-items-center rounded-full border-2 text-xs font-semibold transition-colors",
                done && "border-emerald-600 bg-emerald-600 text-white",
                current && "border-primary bg-primary text-primary-foreground",
                !done && !current && "border-border text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3.5" /> : s.n}
            </span>
            <span
              className={cn(
                "hidden sm:inline",
                current ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {s.label}
            </span>
            {i < steps.length - 1 ? (
              <span
                className={cn(
                  "h-px w-10 sm:w-16",
                  done ? "bg-emerald-600" : "bg-border",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card brand icons (inline SVG, so no dep + always ships)                    */
/* -------------------------------------------------------------------------- */

function VisaMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-9 items-center justify-center rounded bg-white text-[10px] font-black italic tracking-tight text-[#1A1F71] shadow-sm ring-1 ring-black/5",
        className,
      )}
    >
      VISA
    </span>
  );
}

function MastercardMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-9 items-center justify-center rounded bg-white shadow-sm ring-1 ring-black/5",
        className,
      )}
      aria-label="Mastercard"
    >
      <svg viewBox="0 0 40 24" className="h-4 w-6" aria-hidden>
        <circle cx="15" cy="12" r="7.5" fill="#EB001B" />
        <circle cx="25" cy="12" r="7.5" fill="#F79E1B" />
        <path
          d="M20 6.5a7.5 7.5 0 000 11 7.5 7.5 0 000-11z"
          fill="#FF5F00"
        />
      </svg>
    </span>
  );
}

function AmexMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-9 items-center justify-center rounded bg-[#2E77BC] text-[7.5px] font-black tracking-tight text-white shadow-sm ring-1 ring-black/5",
        className,
      )}
    >
      AMEX
    </span>
  );
}

function DinersMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-9 items-center justify-center rounded bg-white shadow-sm ring-1 ring-black/5",
        className,
      )}
      aria-label="Diners Club"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="#0079BE" />
        <path
          d="M9 6a6 6 0 000 12V6zm6 0v12a6 6 0 000-12z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 1 – Address                                                          */
/* -------------------------------------------------------------------------- */

function AddressStep({
  onDone,
  country,
  setCountry,
  t,
  closeLabel,
}: {
  onDone: (data: AddressData) => void;
  country: (typeof COUNTRIES)[number];
  setCountry: (c: (typeof COUNTRIES)[number]) => void;
  t: CheckoutDict;
  closeLabel: string;
}) {
  const [saving, setSaving] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success(t.address.toastSaved);
      onDone({
        firstName: (fd.get("firstName") as string) ?? "",
        lastName: (fd.get("lastName") as string) ?? "",
        email: (fd.get("email") as string) ?? "",
        company: (fd.get("company") as string) ?? "",
        country: country.code,
      });
    }, 400);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
    >
      <Link
        href="/cart"
        aria-label={closeLabel}
        className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <X className="size-5" />
      </Link>

      <header className="border-b border-border/70 bg-card px-8 py-7 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t.address.title}</h2>
        <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-600">
          <ShieldCheck className="size-4" />
          {t.address.secure}
        </p>
      </header>

      <div className="space-y-5 px-8 py-8">
        <Field label={t.address.country} required>
          <div className="relative">
            <select
              required
              value={country.code}
              onChange={(e) => {
                const c = COUNTRIES.find((x) => x.code === e.target.value);
                if (c) setCountry(c);
              }}
              className={cn(inputBase, "appearance-none pr-10 font-medium")}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>

        <Field label={t.address.firstName} required>
          <input required name="firstName" autoComplete="given-name" className={inputBase} />
        </Field>

        <Field label={t.address.lastName} required>
          <input required name="lastName" autoComplete="family-name" className={inputBase} />
        </Field>

        <Field label={t.address.email}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder={t.address.emailPlaceholder}
            className={inputBase}
          />
        </Field>

        <Field label={t.address.company}>
          <input
            name="company"
            autoComplete="organization"
            placeholder={t.address.companyPlaceholder}
            className={inputBase}
          />
        </Field>

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={saving}
            className="min-w-[280px] rounded-full text-base font-semibold shadow-md hover:shadow-lg"
          >
            {saving ? t.address.saving : t.address.save}
          </Button>
        </div>

        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          {t.address.encrypted}
        </p>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 2 – Payment method                                                    */
/* -------------------------------------------------------------------------- */

type AddressData = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  country: string;
};

function PaymentStep({
  onBack,
  total,
  t,
  closeLabel,
  address,
  lines,
}: {
  onBack: () => void;
  total: number;
  t: CheckoutDict;
  closeLabel: string;
  address: AddressData;
  lines: ReturnType<typeof useCartStore.getState>["lines"];
}) {
  const [paying, setPaying] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaying(true);
    try {
      await createOrder({
        customerFirstName: address.firstName,
        customerLastName: address.lastName,
        customerEmail: address.email,
        customerCompany: address.company || undefined,
        country: address.country,
        items: lines.map((l) => ({
          productId: l.productId,
          name: l.name,
          quantity: l.quantity,
          priceCents: l.priceCents,
        })),
        subtotalCents: total,
        currency: "USD",
      });
      toast.success(t.payment.toastPaid);
    } catch (err) {
      console.error("[checkout] order creation failed:", err);
      toast.error("Order could not be submitted — please try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
    >
      <Link
        href="/cart"
        aria-label={closeLabel}
        className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <X className="size-5" />
      </Link>

      <header className="border-b border-border/70 bg-card px-8 py-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {t.payment.backToAddress}
        </button>
        <h2 className="text-2xl font-bold tracking-tight">{t.payment.title}</h2>
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
          <ShieldCheck className="size-4" />
          {t.payment.secure}
        </p>
      </header>

      <div className="space-y-6 px-8 py-8">
        {/* Card panel */}
        <div className="rounded-xl border border-border bg-background/50 p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <CreditCard className="size-5" />
            <span className="text-sm font-semibold text-foreground">{t.payment.card}</span>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t.payment.cardInfo}
              </label>
              <div className="relative">
                <input
                  required
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder={t.payment.cardNumberPlaceholder}
                  className={cn(
                    inputBase,
                    "pr-40 font-mono tracking-wider ring-2 ring-primary/40",
                  )}
                />
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-1">
                  <VisaMark />
                  <MastercardMark />
                  <AmexMark />
                  <DinersMark />
                </div>
              </div>
              <div className="mt-0 grid grid-cols-2 -space-x-px">
                <input
                  required
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder={t.payment.expPlaceholder}
                  className="block w-full rounded-none rounded-bl-xl border border-border bg-background px-4 py-3.5 text-sm shadow-sm outline-none focus:z-10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="relative">
                  <input
                    required
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder={t.payment.cvcPlaceholder}
                    className="block w-full rounded-none rounded-br-xl border border-border bg-background px-4 py-3.5 pr-12 text-sm shadow-sm outline-none focus:z-10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                    <svg
                      viewBox="0 0 24 16"
                      className="h-5 w-6"
                      aria-hidden
                    >
                      <rect
                        x="0.5"
                        y="0.5"
                        width="23"
                        height="15"
                        rx="2"
                        fill="none"
                        stroke="currentColor"
                      />
                      <text
                        x="12"
                        y="11"
                        textAnchor="middle"
                        fontSize="7"
                        fontFamily="monospace"
                        fill="currentColor"
                      >
                        123
                      </text>
                    </svg>
                  </span>
                </div>
              </div>
              {/* Merge borders visually (already stitched via -space-x-px and rounded corners) */}
              <div className="-mt-px h-px bg-transparent" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t.payment.holderName}
              </label>
              <input
                required
                name="cardName"
                autoComplete="cc-name"
                placeholder={t.payment.holderPlaceholder}
                className={inputBase}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={paying}
          className="w-full rounded-xl bg-foreground py-3.5 text-base font-semibold text-background shadow-lg hover:bg-foreground/90"
        >
          {paying ? t.payment.processing : `${t.payment.pay} ${formatEur(total)}`}
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          {t.payment.legal}
        </p>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Root                                                                       */
/* -------------------------------------------------------------------------- */

export function CheckoutPlaceholder() {
  const { dict } = useI18n();
  const t = dict.checkout;
  const closeLabel = dict.common.close;

  const lines = useCartStore((s) => s.lines);
  const subtotal = cartSubtotal(lines);
  const hydrated = useSyncExternalStore(
    (onChange) => useCartStore.persist.onFinishHydration(onChange),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [step, setStep] = useState<1 | 2>(1);
  const [address, setAddress] = useState<AddressData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    country: COUNTRIES[0].code,
  });

  if (hydrated && lines.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <p className="text-lg font-semibold">{t.emptyCart.title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t.emptyCart.body}</p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/shop">{t.emptyCart.cta}</Link>
        </Button>
      </div>
    );
  }

  const itemsLabel =
    lines.length === 1 ? t.summary.itemsSingular : t.summary.itemsPlural;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <Stepper step={step} t={t} />
        {step === 1 ? (
          <AddressStep
            onDone={(data) => { setAddress(data); setStep(2); }}
            country={country}
            setCountry={setCountry}
            t={t}
            closeLabel={closeLabel}
          />
        ) : (
          <PaymentStep
            onBack={() => setStep(1)}
            total={subtotal}
            t={t}
            closeLabel={closeLabel}
            address={address}
            lines={lines}
          />
        )}
      </div>

      <aside className="h-fit space-y-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border/70 px-5 py-4">
            <p className="text-sm font-semibold">{t.summary.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {lines.length} {itemsLabel}
            </p>
          </div>
          <ul className="divide-y divide-border/60 px-5">
            {lines.map((line) => (
              <li
                key={line.productId}
                className="flex justify-between gap-3 py-3 text-sm"
              >
                <span className="truncate text-foreground">
                  {line.name}
                  {line.quantity > 1 ? (
                    <span className="ms-1 text-muted-foreground">
                      × {line.quantity}
                    </span>
                  ) : null}
                </span>
                <span className="font-mono text-foreground">
                  {formatEur(line.priceCents * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-border/60 bg-secondary/30 px-5 py-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>{t.summary.subtotal}</span>
              <span className="font-mono">{formatEur(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{t.summary.shipping}</span>
              <span className="font-mono text-emerald-600">
                {t.summary.shippingValue}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-t border-border/60 pt-3 text-base font-bold">
              <span>{t.summary.total}</span>
              <span className="text-primary">{formatEur(subtotal)}</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 text-xs leading-relaxed text-muted-foreground shadow-sm">
          <p className="flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheck className="size-4 text-emerald-600" />
            {t.summary.secureTitle}
          </p>
          <p className="mt-2">{t.summary.secureNote}</p>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link href="/cart">{dict.common.backToCart}</Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}
