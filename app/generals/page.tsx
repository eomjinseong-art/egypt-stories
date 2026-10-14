import Link from "next/link";
import { CoupangCard } from "@/components/CoupangCard";
import { GCrumbs, GLinks } from "@/components/GLinks";
import { ERAS, GENERALS_INTRO, GENERALS_SEE_ALSO, generals } from "@/data/generals";
import { GENERALS_COUPANG, gMeta } from "@/lib/generals-meta";
import { KIND_LABEL } from "@/lib/generals-types";

export const metadata = gMeta("유명한 장군", `${generals.map((g) => g.nameKo).slice(0, 6).join(", ")} 등 장군 ${generals.length}명. 쉬운 한국어 소개, 전투, 맞수와 동료, 관련 영화.`, "/generals");

export default function GeneralsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <GCrumbs items={[{ href: "/", label: "홈" }, { label: "장군" }]} />
      <header className="mt-4">
        <p className="text-xs tracking-[0.2em] text-terra">GENERALS</p>
        <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">유명한 장군</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{GENERALS_INTRO}</p>
      </header>
      <p className="mt-5 text-sm">
        <Link href="/generals/quiz" className="rounded-full bg-terra px-4 py-2 text-white">
          장군 퀴즈 풀기 →
        </Link>
      </p>
      {ERAS.map((era) => {
        const list = generals.filter((g) => g.era === era);
        if (!list.length) return null;
        return (
          <section key={era} className="mt-10">
            <h2 className="font-serif text-2xl text-ink">{era}</h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {list.map((g) => (
                <li key={g.slug} className="rounded-lg border border-line bg-card p-5">
                  <p className="text-[11px] tracking-[0.16em] text-terra">
                    {g.nameEn.toUpperCase()} · {KIND_LABEL[g.kind]}
                  </p>
                  <h3 className="mt-1 font-serif text-xl text-ink">
                    <Link href={`/generals/${g.slug}`} className="hover:text-terra">
                      {g.nameKo}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs text-muted">{g.years}</p>
                  <p className="mt-2 text-sm leading-6">{g.ko}</p>
                  <p className="mt-2 text-xs text-muted">전투: {g.battles.map((b) => b.label).join(" · ")}</p>
                  <Link href={`/generals/${g.slug}`} className="mt-3 inline-block text-sm text-terra">
                    자세히 →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <div className="mx-auto max-w-3xl">
        <GLinks title="이어서 보기" links={GENERALS_SEE_ALSO} />
      </div>
      <CoupangCard copy={GENERALS_COUPANG} />
    </div>
  );
}
