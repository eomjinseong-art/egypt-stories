import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { KindBadge } from "@/components/KindBadge";
import { PageHead } from "@/components/PageHead";
import { RelatedMovies } from "@/components/RelatedMovies";
import { GROUP_LABEL, rulers } from "@/data/rulers";
import type { Ruler, RulerGroup } from "@/data/types";
import { breadcrumbLd, itemListLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "파라오",
  description: "나르메르, 조세르, 쿠푸, 하트셉수트, 아케나텐, 투탕카멘, 람세스 2세, 클레오파트라 7세 등 길을 잡는 파라오 열두 사람. 전체 왕 명단이 아닙니다.",
  path: "/rulers",
});

const ORDER: RulerGroup[] = ["early", "middle", "new", "late"];

function RulerList({ people }: { people: readonly Ruler[] }) {
  return (
    <ul className="mt-4 grid gap-3">
      {people.map((person) => (
        <li key={person.slug}>
          <Link href={`/rulers/${person.slug}`} className="block rounded-lg border border-line bg-card p-4 hover:border-nile">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] tracking-[0.16em] text-gold">{person.nameEn}</p>
              <KindBadge kind={person.kind} />
            </div>
            <h3 className="mt-1 font-serif text-xl text-ink">{person.nameKo}</h3>
            <p className="mt-1 text-xs text-muted">
              {person.egyptian} · {person.years}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">{person.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function RulersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "파라오", path: "/rulers" },
          ]),
          itemListLd(
            "길을 잡는 파라오",
            "/rulers",
            rulers.map((person) => ({ name: person.nameKo, path: `/rulers/${person.slug}` })),
          ),
        ])}
      />
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { label: "파라오" }]} />
      <PageHead
        kicker="PHARAOHS"
        title="파라오"
        lead="파라오는 이집트의 왕입니다. 삼천 년의 이름을 다 외울 필요는 없습니다. 시대가 바뀔 때 서 있던 열두 사람만 골랐습니다. 카프레, 네페르티티, 넥타네보 2세처럼 여기 없는 이름은 연결된 글에서 짧게 위치를 알려 줍니다."
      />
      {ORDER.map((group) => {
        const meta = GROUP_LABEL[group];
        const people = rulers.filter((person) => person.group === group);
        return (
          <section key={group} className="mt-10">
            <h2 className="font-serif text-2xl text-ink">{meta.title}</h2>
            <p className="mt-1 text-sm text-muted">{meta.note}</p>
            <RulerList people={people} />
          </section>
        );
      })}
      <RelatedMovies topic="rulers" />
    </div>
  );
}
