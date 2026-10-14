import Link from "next/link";
import type { GLink } from "@/lib/generals-types";

export function GLinks({ title, links }: { title: string; links: readonly GLink[] }) {
  if (!links.length) return null;
  return (
    <section className="mt-8">
      <h2 className="font-serif text-xl text-ink">{title}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.href + l.label}>
            {l.href.startsWith("/") ? (
              <Link href={l.href} className="inline-block rounded-full border border-line bg-card px-3 py-1.5 text-sm hover:border-terra hover:text-terra">
                {l.label}
              </Link>
            ) : (
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border border-line bg-card px-3 py-1.5 text-sm hover:border-terra hover:text-terra">
                {l.label} ↗
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function GCrumbs({ items }: { items: readonly { href?: string; label: string }[] }) {
  return (
    <nav aria-label="현재 위치" className="text-xs text-muted">
      {items.map((it, i) => (
        <span key={it.label}>
          {i > 0 ? " / " : ""}
          {it.href ? (
            <Link href={it.href} className="hover:text-terra">
              {it.label}
            </Link>
          ) : (
            <span aria-current="page">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
