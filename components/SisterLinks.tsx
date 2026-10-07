import { FAMILY_LABEL, SISTERS } from "@/lib/site";

function SisterAnchor({ href, name, className }: { href: string; name: string; className: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {name}
      <span className="sr-only"> (새 창)</span>
    </a>
  );
}

export function SisterLinkBar() {
  return (
    <nav aria-label={FAMILY_LABEL} className="border-t border-line/80 bg-stone/70">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-1.5 text-xs">
        <span className="mr-1 font-serif tracking-wide text-gold">{FAMILY_LABEL}</span>
        {SISTERS.map((site, index) => (
          <span key={site.href} className="inline-flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden className="text-muted/40">
                ·
              </span>
            ) : null}
            <SisterAnchor href={site.href} name={site.name} className="text-ink hover:text-nile" />
          </span>
        ))}
      </div>
    </nav>
  );
}

export function SisterLinkList() {
  return (
    <nav aria-label={FAMILY_LABEL} className="mt-4">
      <p className="font-serif text-xs tracking-wide text-gold">{FAMILY_LABEL}</p>
      <ul className="mt-1 space-y-1 text-xs leading-6">
        {SISTERS.map((site) => (
          <li key={site.href}>
            <SisterAnchor href={site.href} name={site.name} className="text-ink underline decoration-line underline-offset-4 hover:text-nile" />
            <span className="text-muted"> — {site.desc}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
