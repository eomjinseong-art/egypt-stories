import type { Source } from "@/data/types";

export function SourceList({ sources, title = "근거로 삼은 기록" }: { sources: readonly Source[]; title?: string }) {
  if (!sources.length) return null;
  return (
    <section className="mt-8 rounded-md border border-line bg-card p-4">
      <h2 className="font-serif text-base text-ink">{title}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
        {sources.map((source) => (
          <li key={`${source.work}-${source.ref ?? ""}`}>
            <span className="text-ink">{source.work}</span>
            {source.ref ? <span> · {source.ref}</span> : null}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs leading-5 text-muted">인용문은 만들지 않았습니다. 기록의 이름과 위치만 적습니다.</p>
    </section>
  );
}
