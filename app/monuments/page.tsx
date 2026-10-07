import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideBlock } from "@/components/GuideBlock";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { RelatedMovies } from "@/components/RelatedMovies";
import { SourceList } from "@/components/SourceList";
import { monumentSources, monuments } from "@/data/monuments";
import { breadcrumbLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "피라미드·신전·무덤",
  description: "기자 피라미드, 스핑크스, 카르나크와 아부심벨, 왕가의 계곡. 왜 만들었는지, 건설에서 아는 것과 모르는 것, 저주 전설과 발굴을 나눕니다.",
  path: "/monuments",
});

export default function MonumentsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "피라미드·신전·무덤", path: "/monuments" },
          ]),
        ])}
      />
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { label: "유적" }]} />
      <PageHead
        kicker="MONUMENTS"
        title="피라미드·신전·무덤"
        lead="돌이 많이 남은 이유는 이집트 사람이 돌에서만 살아서가 아닙니다. 집은 진흙이었고, 왕과 신의 자리는 돌로 남겼습니다. 어떻게 쌓았는지는 일부가 밝혀졌고, 일부가 아직 논쟁입니다."
      />
      <div className="mt-8 space-y-4">
        {monuments.map((item) => (
          <GuideBlock key={item.id} id={item.id} en={item.en} title={item.title} summary={item.summary} points={item.points} more={item.more} kind={item.kind} />
        ))}
      </div>
      <RelatedMovies topic="monuments" />
      <SourceList sources={monumentSources} />
    </article>
  );
}
