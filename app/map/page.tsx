import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideBlock } from "@/components/GuideBlock";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { RelatedLinks } from "@/components/RelatedLinks";
import { regions } from "@/data/places";
import { breadcrumbLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "지도",
  description: "나일강, 상이집트와 하이집트, 멤피스, 테베, 알렉산드리아, 기자, 카르나크, 왕가의 계곡. 강은 남에서 북으로 흐릅니다.",
  path: "/map",
});

export default function MapPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "지도", path: "/map" },
          ]),
        ])}
      />
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { label: "지도" }]} />
      <PageHead
        kicker="PLACES"
        title="지도"
        lead="이집트 지도에서 가장 먼저 강을 따라가세요. 상이집트는 남쪽, 하이집트는 북쪽 삼각주입니다. 아래 카드는 강, 두 땅, 그리고 글에서 자주 나오는 여섯 자리입니다. 경계는 세기마다 움직였습니다."
      />
      <div className="mt-8 space-y-12">
        {regions.map((region) => (
          <section key={region.id} id={region.id} className="scroll-mt-28">
            <p className="text-[11px] tracking-[0.16em] text-gold">{region.en}</p>
            <h2 className="mt-1 font-serif text-2xl text-ink">{region.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">{region.lead}</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {region.places.map((place) => (
                <GuideBlock key={place.id} id={place.id} en={place.en} title={place.title} summary={place.summary} points={place.points} more={place.more}>
                  {place.links ? <RelatedLinks links={place.links} /> : null}
                </GuideBlock>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
