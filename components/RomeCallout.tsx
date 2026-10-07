import { ROME_NAME, ROME_URL } from "@/lib/site";

export function RomeCallout({ body, href = ROME_URL, label }: { body: string; href?: string; label?: string }) {
  return (
    <aside className="mt-8 rounded-md border border-nile/30 bg-nile/5 p-5">
      <p className="text-xs tracking-[0.18em] text-nile">ROME STORIES</p>
      <h2 className="mt-1 font-serif text-2xl text-ink">로마 쪽은 {ROME_NAME}</h2>
      <p className="mt-2 text-sm leading-7 text-ink">{body}</p>
      <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-nile underline underline-offset-4 hover:text-gold">
        {label ?? `${ROME_NAME}에서 이어 읽기`} →
      </a>
    </aside>
  );
}
