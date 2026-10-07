"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { VisitorCounter } from "@/components/VisitorCounter";
import { GREECE_NAME, GREECE_URL, MYTH_NAME, MYTH_URL, NAV, ROME_NAME, ROME_URL, SITE_NAME, SITE_NAME_EN } from "@/lib/site";

function active(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const SISTERS = [
  { href: MYTH_URL, label: MYTH_NAME },
  { href: ROME_URL, label: ROME_NAME },
  { href: GREECE_URL, label: GREECE_NAME },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2" aria-label={`${SITE_NAME} 홈`}>
          <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full border border-gold bg-stone font-serif text-sm text-nile">
            E
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-lg leading-tight tracking-wide text-ink">{SITE_NAME}</span>
            <span className="mt-0.5 block text-[10px] leading-none tracking-[0.18em] text-gold">{SITE_NAME_EN}</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <nav aria-label="자매 사이트" className="hidden items-center gap-3 lg:flex">
            {SISTERS.map((item) => (
              <a key={item.href} href={item.href} className="text-xs text-muted underline decoration-line underline-offset-4 hover:text-nile" rel="noopener noreferrer">
                {item.label}
              </a>
            ))}
          </nav>
          <VisitorCounter />
        </div>
      </div>
      <nav aria-label="주요 메뉴" className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2">
        {NAV.map((item) => {
          const on = active(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={on ? "page" : undefined}
              className={`shrink-0 rounded-full px-3 py-2 text-sm ${on ? "bg-nile/10 font-semibold text-nile" : "text-muted hover:bg-stone hover:text-ink"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="dentil opacity-70" aria-hidden />
    </header>
  );
}
