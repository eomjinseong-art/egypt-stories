import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { eras } from "@/data/eras";
import { rulers } from "@/data/rulers";
import { wars } from "@/data/wars";
import { jsonLd, pageMetadata, websiteLd } from "@/lib/seo";
import { BRAND_LINE, FAMILY_LABEL, GREECE_NAME, GREECE_URL, HOME_SECTIONS, MYTH_NAME, MYTH_URL, ROME_NAME, ROME_URL, SITE_SUB, SITE_TAGLINE, SISTERS } from "@/lib/site";

export const metadata = pageMetadata({
  title: "홈",
  description: `${SITE_TAGLINE}. ${SITE_SUB}`,
  path: "/",
});

const PATH = [
  { href: "/origins", label: "선왕조에서 프톨레마이오스까지, 여섯 칸" },
  { href: "/map#two-lands", label: "상이집트가 왜 남쪽인지" },
  { href: "/monuments#pyramids", label: "피라미드는 누가, 왜 쌓았는지" },
  { href: "/family-tree", label: "신과 파라오의 가족관계도" },
  { href: "/rulers/hatshepsut", label: "하트셉수트는 어떤 왕이었는지" },
  { href: "/rulers/ramesses-ii", label: "람세스 2세와 영화 속 파라오의 차이" },
  { href: "/cleopatra", label: "클레오파트라와 로마의 곡물" },
  { href: "/gods", label: "이집트 신, 그리고 나두신화와 겹치는 이름" },
  { href: "/daily", label: "범람, 글자, 내세" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-8">
      <JsonLd data={jsonLd([websiteLd(`${SITE_TAGLINE}. ${SITE_SUB}`)])} />
      <section className="py-12 text-center sm:py-16">
        <p className="text-xs tracking-[0.3em] text-gold">EGYPT STORIES</p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">이집트이야기</h1>
        <p className="mt-4 text-lg text-muted">{SITE_TAGLINE}</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted">{SITE_SUB}</p>
        <p className="mt-3 text-xs text-gold">{BRAND_LINE}</p>
        <p className="mx-auto mt-4 max-w-xl text-xs leading-6 text-muted">
          전설은 전설이라고 적습니다. 길을 잡는 파라오 {rulers.length}명, 큰 갈등 {wars.length}개를 짧은 글로 정리했습니다.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link href="/origins" className="rounded-full bg-nile px-4 py-2 text-white hover:bg-nile-deep">
            시대부터 보기
          </Link>
          <a href={MYTH_URL} className="rounded-full border border-line bg-card px-4 py-2 hover:border-nile" target="_blank" rel="noopener noreferrer">
            {MYTH_NAME}
          </a>
          <a href={GREECE_URL} className="rounded-full border border-line bg-card px-4 py-2 hover:border-nile" target="_blank" rel="noopener noreferrer">
            {GREECE_NAME}
          </a>
          <a href={ROME_URL} className="rounded-full border border-line bg-card px-4 py-2 hover:border-nile" target="_blank" rel="noopener noreferrer">
            {ROME_NAME}
          </a>
        </div>
      </section>

      <div className="dentil opacity-50" aria-hidden />

      <section className="mt-10" aria-labelledby="sisters-heading">
        <p className="font-serif text-xs tracking-[0.18em] text-gold">{FAMILY_LABEL}</p>
        <h2 id="sisters-heading" className="mt-1 font-serif text-2xl text-ink">
          나두의 다른 이야기
        </h2>
        <p className="mt-1 text-sm text-muted">이집트는 혼자 떨어진 박물관이 아닙니다. 신화, 그리스, 로마와 맞닿은 곳만 자매 사이트로 넘어갑니다.</p>
        <ul className="mt-4 grid gap-4 lg:grid-cols-3">
          {SISTERS.map((site) => (
            <li key={site.href}>
              <a href={site.href} target="_blank" rel="noopener noreferrer" className="block h-full rounded-lg border border-line bg-card p-5 hover:border-nile">
                <p className="text-[11px] tracking-[0.16em] text-gold">{site.en}</p>
                <h3 className="mt-1 font-serif text-2xl text-ink">{site.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{site.desc}</p>
                <span className="sr-only"> (새 창)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="era-heading">
        <h2 id="era-heading" className="font-serif text-2xl text-ink">
          여섯 시대
        </h2>
        <p className="mt-1 text-sm text-muted">삼천 년을 한 단어로 외우면 어렵습니다. 먼저 이 칸만 나누세요. 연대는 교과서에서 널리 쓰는 눈금입니다.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eras.map((era) => (
            <Link key={era.id} href={`/origins#${era.id}`} className="rounded-lg border border-line bg-card p-5 hover:border-nile">
              <p className="text-[11px] tracking-[0.16em] text-gold">{era.en}</p>
              <h3 className="mt-1 font-serif text-2xl text-ink">{era.title}</h3>
              <p className="mt-1 text-xs text-muted">{era.years}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{era.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="menu-heading">
        <h2 id="menu-heading" className="font-serif text-2xl text-ink">
          모든 길
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {HOME_SECTIONS.map((section, index) => (
            <Link key={section.href} href={section.href} className="group rounded-lg border border-line bg-card p-5 transition hover:border-nile hover:shadow-sm">
              <p className="font-serif text-xs text-gold">
                {String(index + 1).padStart(2, "0")} · {section.en}
              </p>
              <h3 className="mt-1 font-serif text-xl text-ink group-hover:text-nile">{section.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{section.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-ink">처음 읽는 순서</h2>
        <ol className="mt-4 space-y-2 text-sm">
          {PATH.map((item, index) => (
            <li key={item.href}>
              <Link href={item.href} className="text-nile underline decoration-line underline-offset-4 hover:text-gold">
                {index + 1}. {item.label}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
