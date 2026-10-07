import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CauseGrid } from "@/components/CauseGrid";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { RelatedMovies } from "@/components/RelatedMovies";
import { wars } from "@/data/wars";
import { breadcrumbLd, itemListLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "전쟁",
  description: "힉소스, 카데시, 바다 민족, 아시리아, 페르시아의 정복, 알렉산드로스, 로마의 병합. 왜 싸웠는지, 누구와 싸웠는지, 무엇이 바뀌었는지를 짧게 정리합니다.",
  path: "/wars",
});

export default function WarsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "전쟁", path: "/wars" },
          ]),
          itemListLd(
            "이집트의 주요 갈등",
            "/wars",
            wars.map((war) => ({ name: war.title, path: `/wars/${war.slug}` })),
          ),
        ])}
      />
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { label: "전쟁" }]} />
      <PageHead
        kicker="WARS"
        title="전쟁"
        lead="이집트의 삼천 년은 평화로만 이루어지지 않았습니다. 각 카드는 왜, 누구와, 끝나서 무엇이 바뀌었는지만 먼저 보여 줍니다. 출애굽 영화의 전투는 이 목록의 사건이 아닙니다."
      />
      <ul className="mt-8 grid gap-4 lg:grid-cols-2">
        {wars.map((war) => (
          <li key={war.slug} className="rounded-lg border border-line bg-card p-5">
            <p className="text-[11px] tracking-[0.16em] text-gold">{war.en}</p>
            <h2 className="mt-1 font-serif text-2xl text-ink">
              <Link href={`/wars/${war.slug}`} className="hover:text-nile">
                {war.title}
              </Link>
            </h2>
            <p className="mt-1 text-xs text-muted">{war.years}</p>
            <p className="mt-2 text-sm leading-6">{war.summary}</p>
            <CauseGrid cause={war.cause} who={war.who} result={war.result} />
            <Link href={`/wars/${war.slug}`} className="mt-3 inline-block text-sm text-nile">
              세 가지 포인트와 조금만 더 →
            </Link>
          </li>
        ))}
      </ul>
      <div className="mx-auto max-w-3xl">
        <RelatedMovies topic="wars" />
      </div>
    </div>
  );
}
