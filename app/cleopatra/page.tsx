import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideBlock } from "@/components/GuideBlock";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { RelatedMovies } from "@/components/RelatedMovies";
import { RomeCallout } from "@/components/RomeCallout";
import { SourceList } from "@/components/SourceList";
import { cleoSections, cleoSources } from "@/data/cleopatra";
import { articleLd, breadcrumbLd, jsonLd, pageMetadata } from "@/lib/seo";
import { ROME_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "클레오파트라와 로마",
  description: "프톨레마이오스 왕조의 이집트, 클레오파트라 7세, 카이사르와 안토니우스, 악티움과 로마 속주. 연애담 앞에 있는 곡물과 왕위.",
  path: "/cleopatra",
  type: "article",
});

export default function CleopatraPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "클레오파트라와 로마", path: "/cleopatra" },
          ]),
          articleLd({
            headline: "클레오파트라와 로마",
            description: "프톨레마이오스 이집트의 마지막 통치자와 로마 내전. 카이사르, 안토니우스, 악티움.",
            path: "/cleopatra",
            about: ["Cleopatra VII", "Julius Caesar", "Mark Antony", "Actium"],
          }),
        ])}
      />
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { label: "클레오파트라와 로마" }]} />
      <PageHead
        kicker="CLEOPATRA"
        title="클레오파트라와 로마"
        lead="영화가 먼저 보여주는 것은 배와 연회입니다. 로마가 원한 것은 이집트의 곡물이었고, 두려워한 것은 로마 장군이 동방의 왕이 되는 일이었습니다."
      />
      <div className="mt-8 space-y-4">
        {cleoSections.map((section) => (
          <GuideBlock
            key={section.id}
            id={section.id}
            en={section.en}
            title={section.title}
            summary={section.summary}
            points={section.points}
            more={section.more}
            kind={section.kind}
          />
        ))}
      </div>
      <RomeCallout
        href={`${ROME_URL}/cleopatra`}
        body="악티움, 아우구스투스, 원로원 쪽의 정치 언어는 로마이야기에 있습니다. 이집트이야기는 알렉산드리아에서 본 같은 이십 년을 적습니다."
      />
      <RelatedMovies topic="cleopatra" />
      <SourceList sources={cleoSources} />
    </article>
  );
}
