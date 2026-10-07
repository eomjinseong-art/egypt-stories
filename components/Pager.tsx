import Link from "next/link";

export function Pager({
  prev,
  next,
}: {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}) {
  return (
    <nav className="mt-10 flex justify-between gap-4 border-t border-line pt-4 text-sm" aria-label="앞뒤 글">
      {prev ? (
        <Link href={prev.href} className="text-nile hover:text-gold">
          ← {prev.label}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="text-right text-nile hover:text-gold">
          {next.label} →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
