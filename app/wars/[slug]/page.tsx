import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CauseGrid } from "@/components/CauseGrid";
import { JsonLd } from "@/components/JsonLd";
import { KeyPoints } from "@/components/KeyPoints";
import { More } from "@/components/More";
import { Pager } from "@/components/Pager";
import { RelatedLinks } from "@/components/RelatedLinks";
import { RelatedMovies } from "@/components/RelatedMovies";
import { Rich } from "@/components/Rich";
import { SourceList } from "@/components/SourceList";
import { warBySlug, wars } from "@/data/wars";
import { articleLd, breadcrumbLd, jsonLd, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return wars.map((war) => ({ slug: war.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const war = warBySlug(slug);
  if (!war) return {};
  return pageMetadata({
    title: `${war.title} (${war.en})`,
    description: `${war.title}(${war.years}). ${war.summary} ${war.result}`,
    path: `/wars/${war.slug}`,
    type: "article",
  });
}

export default async function WarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const war = warBySlug(slug);
  if (!war) notFound();
  const index = wars.findIndex((item) => item.slug === war.slug);
  const prev = wars[index - 1];
  const next = wars[index + 1];
  const path = `/wars/${war.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "전쟁", path: "/wars" },
            { name: war.title, path },
          ]),
          articleLd({ headline: war.title, description: war.summary, path, about: [war.en] }),
        ])}
      />
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { href: "/wars", label: "전쟁" }, { label: war.title }]} />
      <header className="mt-4">
        <p className="text-xs tracking-[0.2em] text-gold">{war.en}</p>
        <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">{war.title}</h1>
        <p className="mt-2 text-sm text-muted">{war.years}</p>
        <p className="mt-3 text-base leading-8">
          <Rich text={war.summary} />
        </p>
      </header>
      <CauseGrid cause={war.cause} who={war.who} result={war.result} />
      <KeyPoints items={war.points} />
      <More>
        {war.more.map((paragraph) => (
          <p key={paragraph}>
            <Rich text={paragraph} />
          </p>
        ))}
      </More>
      <RelatedLinks links={war.related} />
      {war.movieSlugs.length ? (
        <RelatedMovies slugs={war.movieSlugs} />
      ) : (
        <p className="mt-8 text-sm leading-7 text-muted">
          이 갈등을 사건 그대로 다룬 유명한 극영화는 드뭅니다. 출애굽 영화의 전투를 힉소스나 카데시로 외우지 않는 편이 좋습니다. 이집트를 배경으로 한 작품은{" "}
          <Link href="/movies" className="text-nile underline decoration-line underline-offset-4 hover:text-gold">
            영화 목록
          </Link>
          에 모아 두었습니다.
        </p>
      )}
      <SourceList sources={war.sources} />
      <Pager
        prev={prev ? { href: `/wars/${prev.slug}`, label: prev.title } : undefined}
        next={next ? { href: `/wars/${next.slug}`, label: next.title } : undefined}
      />
    </article>
  );
}
