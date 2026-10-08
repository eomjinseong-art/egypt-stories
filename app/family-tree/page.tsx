import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Elsewhere } from "@/components/Elsewhere";
import { FamilyTreeView } from "@/components/FamilyTreeView";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { SisterCrossLinks } from "@/components/SisterLinks";
import { SourceList } from "@/components/SourceList";
import { gods } from "@/data/gods";
import {
  CHRONOLOGY_NOTE,
  FAMILY_CHARTS,
  familyTreeSources,
  formatYears,
  relationsOf,
  type FamilyChart,
} from "@/data/family-tree";
import { rulerBySlug } from "@/data/rulers";
import { breadcrumbLd, itemListLd, jsonLd, pageMetadata } from "@/lib/seo";
import { OTHER_FAMILY_TREES, ROME_URL, sisterOriginAllowed } from "@/lib/site";

const description =
  "이집트 신화의 아툼-라 가계, 제18왕조, 제19왕조, 프톨레마이오스 왕조를 세대별로 그린 가족관계도. 투탕카멘의 부모처럼 불확실한 혈연은 점선으로 구분합니다.";

export const metadata = {
  ...pageMetadata({
    title: "가족관계도",
    description,
    path: "/family-tree",
  }),
  keywords: ["가족관계도", "이집트 신화", "18왕조", "19왕조", "프톨레마이오스", "투탕카멘", "클레오파트라", "람세스"],
};

const ROME_OK = new Set(["/cleopatra", "/wars/actium", "/wars/caesar-civil-war"]);
const godSlugs = new Set(gods.map((god) => god.slug));

for (const chart of FAMILY_CHARTS) {
  for (const node of chart.layout.nodes) {
    if (node.href?.startsWith("/rulers/")) {
      const slug = node.href.slice("/rulers/".length);
      if (!rulerBySlug(slug)) throw new Error(`가족관계도 파라오 링크가 없습니다: ${node.id} ${node.href}`);
    } else if (node.href?.startsWith("/gods#")) {
      const slug = node.href.slice("/gods#".length);
      if (!godSlugs.has(slug)) throw new Error(`가족관계도 신 링크가 없습니다: ${node.id} ${node.href}`);
    } else if (node.href?.startsWith(`${ROME_URL}/`)) {
      const path = node.href.slice(ROME_URL.length);
      if (!ROME_OK.has(path)) throw new Error(`가족관계도 로마이야기 링크가 목록에 없습니다: ${node.id} ${node.href}`);
    } else if (node.href) {
      throw new Error(`가족관계도 링크를 확인할 수 없습니다: ${node.id} ${node.href}`);
    }
    for (const extra of node.also ?? []) {
      // Origin check only. iliad-stories is allowlisted and may 404 until that site ships; do not fetch.
      if (!sisterOriginAllowed(extra.href)) {
        throw new Error(`가족관계도 다른 사이트 링크가 허용 목록에 없습니다: ${node.id} ${extra.href}`);
      }
    }
  }
}

const listed = FAMILY_CHARTS.flatMap((chart) => chart.layout.nodes)
  .filter((node) => node.href?.startsWith("/"))
  .map((node) => ({ name: `${node.ko} (${node.roman})`, path: node.href! }));

export default function FamilyTreePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "가족관계도", path: "/family-tree" },
          ]),
          itemListLd("이집트 가족관계도", "/family-tree", listed),
        ])}
      />
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { label: "가족관계도" }]} />
      <PageHead
        kicker="FAMILY TREE"
        title="가족관계도"
        lead="누가 누구의 자녀인지 세대별로 그린 그림입니다. 예를 들어 호루스는 오시리스와 이시스의 아들이고, 하트셉수트는 투트모세 2세의 이복 누이이자 아내입니다. 칸을 누르면 부모·배우자·자녀·형제가 밝아집니다."
      />
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{CHRONOLOGY_NOTE}</p>
      <FamilyTreeView />

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-ink">글로 읽는 가족관계</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
          그림과 같은 관계입니다. 이름을 누르면 그 가계의 그 사람으로 이동합니다. 이 사이트에 글이 있는 이름은 따로 링크했습니다.
        </p>
        {FAMILY_CHARTS.map((chart) => (
          <ChartText key={chart.id} chart={chart} />
        ))}
      </section>

      <SisterCrossLinks title="다른 가족관계도" en="Other family trees" links={OTHER_FAMILY_TREES} />
      <SourceList sources={familyTreeSources} />
    </div>
  );
}

function ChartText({ chart }: { chart: FamilyChart }) {
  return (
    <section className="mt-10" aria-labelledby={`text-${chart.id}`}>
      <h3 id={`text-${chart.id}`} className="font-serif text-2xl text-ink">
        {chart.ko} <span className="text-sm font-sans tracking-wide text-gold">{chart.en}</span>
      </h3>
      <p className="mt-1 max-w-3xl text-sm leading-7 text-muted">{chart.lead}</p>
      {chart.layout.bands.map((band) => (
        <section key={band.id} className="mt-6">
          <h4 className="font-serif text-xl" style={{ color: band.color }}>
            {band.ko} <span className="text-sm font-sans tracking-wide text-gold">{band.en}</span>
          </h4>
          <p className="mt-1 text-sm leading-6 text-muted">{band.hint}</p>
          <ul className="mt-3 space-y-4">
            {band.nodeIds.map((id) => {
              const node = chart.layout.byId.get(id)!;
              const rel = relationsOf(chart.layout, id);
              return (
                <li key={id} className="border-b border-line/80 pb-3 text-sm leading-7">
                  <a href={`/family-tree?tab=${chart.id}&focus=${node.id}`} className="font-serif text-base text-ink hover:text-gold">
                    {node.ko}
                  </a>
                  <span className="text-muted"> / {node.roman}</span>
                  {node.years ? <span className="ml-2 text-xs text-gold">{formatYears(node.years)}</span> : null}
                  {node.href ? <PersonLink href={node.href} /> : null}
                  <span className="mt-0.5 block text-ink">{node.summary}</span>
                  {node.note ? <span className="mt-0.5 block text-xs leading-5 text-dusk">불확실·다른 전승: {node.note}</span> : null}
                  <Elsewhere links={node.also} />
                  <span className="mt-1 block text-xs leading-5 text-muted">
                    <Kin chartId={chart.id} label="부모" people={rel.parents} />
                    <Kin chartId={chart.id} label="불확실한 부모" people={rel.variantParents} />
                    <Kin chartId={chart.id} label="배우자" people={rel.spouses} />
                    <Kin chartId={chart.id} label="불확실한 배우자" people={rel.variantSpouses} />
                    <Kin chartId={chart.id} label="자녀" people={rel.children} />
                    <Kin chartId={chart.id} label="불확실한 자녀" people={rel.variantChildren} />
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      {chart.disputes.length ? (
        <div className="mt-6">
          <h4 className="font-serif text-xl text-ink">다른 전승·불확실한 혈연</h4>
          <ul className="mt-3 space-y-3">
            {chart.disputes.map((item) => (
              <li key={item.id} className="rounded-md border border-line bg-card p-4 text-sm leading-7">
                <h5 className="font-serif text-lg text-ink">{item.title}</h5>
                <p className="mt-1">
                  <span className="text-gold">기준으로 둔 것. </span>
                  {item.main}
                </p>
                <p className="mt-1">
                  <span className="text-dusk">다투거나 다른 전승. </span>
                  {item.other}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {chart.notes.length ? (
        <div className="mt-6">
          <h4 className="font-serif text-lg text-ink">읽을 때</h4>
          <ul className="mt-2 space-y-2 text-sm leading-7 text-muted">
            {chart.notes.map((note) => (
              <li key={note.title}>
                <span className="text-ink">{note.title}. </span>
                {note.body}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function PersonLink({ href }: { href: string }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className="ml-2 text-nile">
        이 사이트의 글
      </Link>
    );
  }
  return (
    <a href={href} className="ml-2 text-nile" target="_blank" rel="noopener noreferrer">
      로마이야기
    </a>
  );
}

function Kin({ chartId, label, people }: { chartId: string; label: string; people: { id: string; ko: string }[] }) {
  if (!people.length) return null;
  return (
    <span className="mr-3 inline">
      {label}{" "}
      {people.map((person, index) => (
        <span key={person.id}>
          {index > 0 ? ", " : null}
          <a href={`/family-tree?tab=${chartId}&focus=${person.id}`} className="text-nile underline decoration-line underline-offset-2 hover:text-gold">
            {person.ko}
          </a>
        </span>
      ))}
    </span>
  );
}
