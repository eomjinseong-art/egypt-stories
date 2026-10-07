import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideBlock } from "@/components/GuideBlock";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { RelatedMovies } from "@/components/RelatedMovies";
import { SourceList } from "@/components/SourceList";
import { eras } from "@/data/eras";
import { breadcrumbLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "시대",
  description: "선왕조에서 고왕국·중왕국·신왕국, 후기, 프톨레마이오스까지. 이집트 삼천 년을 여섯 칸으로 나누고, 중간기의 틈을 숨기지 않습니다.",
  path: "/origins",
});

const sources = [
  { work: "팔레르모 석과 토리노 왕명표", ref: "왕과 햇수를 적으려 한 이집트 쪽 목록. 손상된 부분이 많습니다" },
  { work: "마네토 『이집트사』", ref: "기원전 3세기 그리스어 왕조 목록. 후대 인용으로만 남음" },
  { work: "이언 쇼 편, The Oxford History of Ancient Egypt", ref: "시대 구분을 잡는 현대 개설. 문장은 옮기지 않았습니다" },
  { work: "마크 판 더 미에롭, A History of Ancient Egypt", ref: "대학 개설. 문장은 옮기지 않았습니다" },
];

export default function OriginsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "시대", path: "/origins" },
          ]),
        ])}
      />
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { label: "시대" }]} />
      <PageHead
        kicker="ORIGINS"
        title="시대"
        lead="이집트가 어려운 이유는 선사 마을, 피라미드, 제국, 페르시아, 그리스 왕, 로마 속주가 한 나라 이름으로 불리기 때문입니다. 아래 여섯 칸만 먼저 나누면 됩니다. 칸과 칸 사이의 중간기도 글 안에 숨기지 않았습니다."
      />
      <div className="mt-8 space-y-4">
        {eras.map((era) => (
          <GuideBlock key={era.id} id={era.id} en={era.en} title={era.title} summary={`${era.years}. ${era.summary}`} points={era.points} more={era.more} kind={era.kind} />
        ))}
      </div>
      <p className="mt-6 text-sm leading-7 text-muted">
        강과 도시는 <Link href="/map" className="text-nile underline decoration-line underline-offset-4 hover:text-gold">지도</Link>
        로, 사람 이름은 <Link href="/rulers" className="text-nile underline decoration-line underline-offset-4 hover:text-gold">파라오</Link>로 가면 됩니다.
      </p>
      <RelatedMovies topic="origins" />
      <SourceList sources={sources} />
    </article>
  );
}
