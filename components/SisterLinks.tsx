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
    <nav aria-label={FAMILY_LABEL} className="overflow-x-auto border-t border-line/80 bg-stone/70">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-1.5 text-xs">
        <span className="mr-1 shrink-0 font-serif tracking-wide text-gold">{FAMILY_LABEL}</span>
        {SISTERS.map((site, index) => (
          <span key={site.href} className="inline-flex max-w-full flex-wrap items-baseline gap-x-1">
            {index > 0 ? (
              <span aria-hidden className="text-muted/40">
                ·
              </span>
            ) : null}
            <SisterAnchor href={site.href} name={site.name} className="text-ink hover:text-nile" />
            <span className="text-[10px] text-muted">{site.en}</span>
          </span>
        ))}
      </div>
    </nav>
  );
}

export function SisterLinkList() {
  return (
    <nav aria-label={FAMILY_LABEL} className="mt-4 max-w-full">
      <p className="font-serif text-xs tracking-wide text-gold">{FAMILY_LABEL}</p>
      <ul className="mt-1 space-y-1 text-xs leading-6">
        {SISTERS.map((site) => (
          <li key={site.href} className="break-words">
            <SisterAnchor href={site.href} name={site.name} className="text-ink underline decoration-line underline-offset-4 hover:text-nile" />
            <span className="text-muted"> ({site.en})</span>
            <span className="text-muted"> — {site.desc}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SisterCrossLinks({
  title,
  en,
  links,
}: {
  title: string;
  en: string;
  links: readonly { href: string; label: string; en: string }[];
}) {
  return (
    <nav aria-label={title} className="mt-10 max-w-full rounded-lg border border-line bg-card p-4 sm:p-5">
      <h2 className="font-serif text-xl text-ink">
        {title} <span className="font-sans text-sm tracking-wide text-gold">{en}</span>
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href} className="max-w-full">
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full flex-wrap items-baseline gap-x-1.5 rounded-full border border-line bg-bg px-3 py-1.5 text-sm hover:border-nile"
            >
              <span>{link.label}</span>
              <span className="text-[10px] tracking-wide text-gold">{link.en}</span>
              <span className="sr-only"> (새 창)</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
