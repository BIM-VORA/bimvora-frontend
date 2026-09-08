"use client";

import { Check, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  dir,
  LOCALE_COOKIE,
  LOCALE_META,
  LOCALES,
  type Locale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { useI18n } from "./i18n-provider";

type LanguageSwitcherProps = {
  className?: string;
  variant?: "icon" | "inline";
};

function persistLocale(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  // Update direction/lang immediately for a snappy switch before refresh.
  document.documentElement.lang = next;
  document.documentElement.dir = dir(next);
}

export function LanguageSwitcher({
  className,
  variant = "icon",
}: LanguageSwitcherProps) {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function selectLocale(next: Locale) {
    if (next === locale) return;
    persistLocale(next);
    startTransition(() => router.refresh());
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={dict.header.language}
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-sm text-muted-foreground outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
          className,
        )}
      >
        <Globe className="size-4" />
        {variant === "inline" ? (
          <span>{LOCALE_META[locale].native}</span>
        ) : (
          <span className="font-mono text-xs uppercase">{locale}</span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LOCALES.map((code) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => selectLocale(code)}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>{LOCALE_META[code].flag}</span>
              {LOCALE_META[code].native}
            </span>
            {code === locale ? <Check className="size-4 text-copper" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
