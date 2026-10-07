import type { ReactNode } from "react";
import { KeyPoints } from "@/components/KeyPoints";
import { KindBadge } from "@/components/KindBadge";
import { More } from "@/components/More";
import { Rich } from "@/components/Rich";
import type { Kind } from "@/data/types";

export function GuideBlock({
  id,
  en,
  title,
  summary,
  points,
  more,
  kind,
  children,
}: {
  id?: string;
  en: string;
  title: string;
  summary: string;
  points: readonly string[];
  more?: readonly string[];
  kind?: Kind;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 rounded-lg border border-line bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[11px] font-medium tracking-[0.16em] text-gold">{en}</p>
        {kind ? <KindBadge kind={kind} /> : null}
      </div>
      <h2 className="mt-1 font-serif text-2xl leading-snug text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-ink">
        <Rich text={summary} />
      </p>
      <KeyPoints items={points} />
      {more && more.length ? (
        <More>
          {more.map((paragraph) => (
            <p key={paragraph}>
              <Rich text={paragraph} />
            </p>
          ))}
        </More>
      ) : null}
      {children}
    </section>
  );
}
