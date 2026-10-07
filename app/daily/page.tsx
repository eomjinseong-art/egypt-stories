import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideBlock } from "@/components/GuideBlock";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { SourceList } from "@/components/SourceList";
import { dailyLead, dailySources, dailyTopics } from "@/data/daily";
import { breadcrumbLd, jsonLd, pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "일상",
  description: "나일강의 범람, 농사, 상형문자, 신전, 내세. 영화의 저주가 아니라 이집트 사람의 하루와 믿음에 가깝게, 삼천 년을 한 풍습으로 묶지 않고 적습니다.",
  path: "/daily",
});

export default function DailyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "일상", path: "/daily" },
          ]),
        ])}
      />
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { label: "일상" }]} />
      <PageHead kicker="DAILY LIFE" title="일상" lead={dailyLead} />
      <div className="mt-8 space-y-4">
        {dailyTopics.map((topic) => (
          <GuideBlock key={topic.id} id={topic.id} en={topic.en} title={topic.title} summary={topic.summary} points={topic.points} more={topic.more} kind="history" />
        ))}
      </div>
      <p className="mt-8 text-sm leading-7 text-muted">
        밥과 글자 자체를 다룬 유명한 극영화는 거의 없습니다. 출애굽을 다룬 작품은 신앙의 이야기라 여기 붙이지 않았습니다. 구분은{" "}
        <Link href="/movies" className="text-nile underline decoration-line underline-offset-4 hover:text-gold">
          영화 목록
        </Link>
        에 있습니다.
      </p>
      <SourceList sources={dailySources} />
    </article>
  );
}
