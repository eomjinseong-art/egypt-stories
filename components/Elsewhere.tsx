import Link from "next/link";
import type { LinkItem } from "@/data/types";

export function Elsewhere({ links, className = "" }: { links?: readonly LinkItem[] | null; className?: string }) {
  if (!links?.length) return null;
  return (
    <aside className={`mt-3 max-w-full rounded-md border border-line bg-stone/70 px-3 py-2 ${className}`}>
      <p className="text-xs text-gold">다른 사이트에서 더 보기</p>
      <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`} className="max-w-full">
            {link.href.startsWith("/") ? (
              <Link href={link.href} className="text-sm text-nile underline decoration-line underline-offset-4 hover:text-gold">
                {link.label}
              </Link>
            ) : (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-nile underline decoration-line underline-offset-4 hover:text-gold">
                {link.label}
                <span className="sr-only"> (새 창)</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
