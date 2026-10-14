import Link from "next/link";
import { notFound } from "next/navigation";
import { CoupangCard } from "@/components/CoupangCard";
import { GCrumbs, GLinks } from "@/components/GLinks";
import { generals } from "@/data/generals";
import { GENERALS_COUPANG, gMeta } from "@/lib/generals-meta";
import { KIND_LABEL } from "@/lib/generals-types";

export const dynamicParams = false;

export function generateStaticParams() {
  return generals.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = generals.find((x) => x.slug === slug);
  if (!g) return {};
  return gMeta(`${g.nameKo} (${g.nameEn})`, `${g.nameKo}(${g.years}). ${g.ko}`, `/generals/${g.slug}`);
}

export default async function GeneralPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = generals.findIndex((x) => x.slug === slug);
  const g = generals[i];
  if (!g) notFound();
  const prev = generals[i - 1];
  const next = generals[i + 1];
  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <GCrumbs items={[{ href: "/", label: "홈" }, { href: "/generals", label: "장군" }, { label: g.nameKo }]} />
      <header className="mt-4">
        <p className="text-xs tracking-[0.2em] text-terra">{g.nameEn.toUpperCase()}</p>
        <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">{g.nameKo}</h1>
        <p className="mt-2 text-sm text-muted">
          {g.native} · {g.years} · {g.era}
        </p>
        <p className="mt-2">
          <span className="rounded-full border border-terra px-2 py-0.5 text-xs text-terra">{KIND_LABEL[g.kind]}</span>
          {g.kind === "legend" ? <span className="ml-2 text-xs text-muted">시와 신화 속 인물입니다. 실존했다는 증거는 없습니다.</span> : null}
        </p>
      </header>
      <p className="mt-4 text-base leading-8">{g.ko}</p>
      <p lang="en" className="mt-2 text-sm italic leading-7 text-muted">
        {g.en}
      </p>
      <GLinks title={g.kind === "legend" ? "주요 싸움 장면" : "주요 전쟁·전투"} links={g.battles} />
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-card p-4 text-sm leading-7">
          <h2 className="font-serif text-lg text-ink">맞수</h2>
          <p className="mt-1">{g.rivals.join(" · ")}</p>
        </div>
        <div className="rounded-lg border border-line bg-card p-4 text-sm leading-7">
          <h2 className="font-serif text-lg text-ink">동료·후원자</h2>
          <p className="mt-1">{g.allies.join(" · ")}</p>
        </div>
      </section>
      {g.tales.length ? (
        <section className="mt-8 rounded-lg border border-dashed border-line p-4 text-sm leading-7">
          <h2 className="font-serif text-lg text-ink">
            전해지는 이야기 <span className="text-xs font-normal text-muted">(사실인지 확인하기 어렵습니다)</span>
          </h2>
          <ul className="mt-2 list-disc pl-5">
            {g.tales.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      ) : null}
      <GLinks title="이 사이트에서 더 보기" links={g.related} />
      {g.films.length ? (
        <GLinks title="관련 영화·시리즈" links={g.films} />
      ) : (
        <p className="mt-8 text-sm leading-7 text-muted">이 장군을 중심에 둔 유명한 극영화는 드뭅니다.</p>
      )}
      <GLinks title="다른 사이트에서 같은 사람 보기" links={g.cross} />
      <section className="mt-8 text-sm leading-7">
        <h2 className="font-serif text-lg text-ink">출처</h2>
        <ul className="mt-1 list-disc pl-5 text-muted">
          {g.sources.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>
      <nav className="mt-10 flex justify-between gap-4 text-sm" aria-label="이전·다음 장군">
        {prev ? <Link href={`/generals/${prev.slug}`} className="text-terra">← {prev.nameKo}</Link> : <span />}
        {next ? <Link href={`/generals/${next.slug}`} className="text-terra">{next.nameKo} →</Link> : <span />}
      </nav>
      <CoupangCard copy={GENERALS_COUPANG} />
    </article>
  );
}
