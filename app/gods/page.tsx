import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideBlock } from "@/components/GuideBlock";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { RelatedMovies } from "@/components/RelatedMovies";
import { SourceList } from "@/components/SourceList";
import { godSources, gods, godsIntro } from "@/data/gods";
import { breadcrumbLd, jsonLd, pageMetadata } from "@/lib/seo";
import { MYTH_NAME, MYTH_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "신",
  description: "라, 아문, 오시리스, 이시스, 호루스, 토트 등 이집트 신을 짧게 소개합니다. 그리스·로마와 이름이 겹치는 곳만 나두신화로 잇고, 없는 신화는 만들지 않습니다.",
  path: "/gods",
});

export default function GodsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "신", path: "/gods" },
          ]),
        ])}
      />
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { label: "신" }]} />
      <PageHead
        kicker="GODS"
        title="신"
        lead="역사 글을 읽다 만나는 신의 이름입니다. 긴 줄거리를 지어 잇지 않습니다. 그리스·로마 작가가 붙인 짝이 있을 때만 나두신화로 넘어갑니다."
      />

      <div className="mt-8 max-w-3xl">
        <GuideBlock en={godsIntro.en} title={godsIntro.title} summary={godsIntro.summary} points={godsIntro.points} more={godsIntro.more} kind="mixed" />
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {gods.map((god) => (
          <li key={god.slug} id={god.slug} className="scroll-mt-28 rounded-lg border border-line bg-card p-4">
            <p className="text-[11px] tracking-[0.16em] text-gold">{god.en}</p>
            <h2 className="mt-1 font-serif text-xl text-ink">
              {god.nameKo}
              <span className="ml-2 font-sans text-sm font-normal text-muted">{god.egyptian}</span>
            </h2>
            <p className="mt-2 text-sm leading-6">{god.summary}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{god.note}</p>
            {god.links.length ? (
              <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                {god.links.map((link) =>
                  link.href.startsWith("/") ? (
                    <Link key={link.href} href={link.href} className="text-nile underline decoration-line underline-offset-4 hover:text-gold">
                      {link.label}
                    </Link>
                  ) : (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-nile underline decoration-line underline-offset-4 hover:text-gold">
                      {link.label}
                    </a>
                  ),
                )}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-3xl text-sm leading-7">
        아툼-라에서 호루스·아누비스까지의 부모 관계는 <Link href="/family-tree?tab=myth" className="text-nile underline decoration-line underline-offset-4 hover:text-gold">가족관계도</Link>에 모았습니다. 그 탭은 신화입니다.
      </p>

      <p className="mt-8 max-w-3xl text-sm leading-7 text-muted">
        기자의 큰 스핑크스는 왕의 상입니다. 오이디푸스 이야기의 스핑크스와 다릅니다. 그 그리스 이야기는{" "}
        <a href={`${MYTH_URL}/gods/sphinx`} target="_blank" rel="noopener noreferrer" className="text-nile underline decoration-line underline-offset-4 hover:text-gold">
          {MYTH_NAME}
        </a>
        에 있습니다. 유적 쪽 구분은 <Link href="/monuments#sphinx" className="text-nile underline decoration-line underline-offset-4 hover:text-gold">스핑크스</Link> 글에 있습니다.
      </p>

      <div className="max-w-3xl">
        <RelatedMovies topic="gods" />
        <SourceList sources={godSources} />
      </div>
    </div>
  );
}
