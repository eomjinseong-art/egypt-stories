import Link from "next/link";
import type { ReactNode } from "react";

function safeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href.startsWith("https://")) return href;
  return null;
}

export function Rich({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const href = safeHref(match[2]);
    if (!href) {
      parts.push(match[0]);
    } else if (href.startsWith("/")) {
      parts.push(
        <Link key={`${match.index}-${href}`} href={href} className="text-nile underline decoration-line underline-offset-4 hover:text-gold">
          {match[1]}
        </Link>,
      );
    } else {
      parts.push(
        <a
          key={`${match.index}-${href}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-nile underline decoration-line underline-offset-4 hover:text-gold"
        >
          {match[1]}
        </a>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
