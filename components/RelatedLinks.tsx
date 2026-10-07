import Link from "next/link";
import type { LinkItem } from "@/data/types";

export function RelatedLinks({ links, title = "이어서 보기" }: { links: readonly LinkItem[]; title?: string }) {
  if (!links.length) return null;
  return (
    <nav aria-label={title} className="mt-4">
      <p className="text-xs text-muted">{title}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            {link.href.startsWith("/") ? (
              <Link href={link.href} className="inline-block rounded-full border border-line bg-bg px-3 py-1.5 text-sm hover:border-nile hover:text-nile">
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-line bg-bg px-3 py-1.5 text-sm hover:border-nile hover:text-nile"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
