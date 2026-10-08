import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { MovieCard } from "@/components/RelatedMovies";
import { PageHead } from "@/components/PageHead";
import { SisterCrossLinks } from "@/components/SisterLinks";
import { movies } from "@/data/movies";
import { OTHER_FILMS } from "@/lib/site";
import { breadcrumbLd, itemListLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "관련 영화",
  description: "미이라, 클레오파트라, 이집트 왕자, 십계, 엑소더스: 신들과 왕들, 갓 오브 이집트, 사카라 무덤의 비밀. 어디서 상상을 돕고 어디서 창작인지, 발굴 다큐멘터리는 어디까지 화면인지 짧게 적습니다. 불법 영상은 안내하지 않습니다.",
  path: "/movies",
});

export default function MoviesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "관련 영화", path: "/movies" },
          ]),
          itemListLd(
            "이집트 관련 영화",
            "/movies",
            movies.map((movie) => ({ name: movie.titleKo, path: `/movies#${movie.slug}` })),
          ),
        ])}
      />
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { label: "관련 영화" }]} />
      <PageHead
        kicker="FILMS"
        title="관련 영화"
        lead="이집트를 처음 상상할 때 영화가 먼저인 경우가 많습니다. 제목은 실제로 공개된 작품만 적었습니다. 『이집트 왕자』는 애니메이션이고, 출애굽 영화들은 신앙의 이야기입니다. 『사카라 무덤의 비밀』은 2020년 넷플릭스 다큐멘터리로, 사카라 발굴을 따라갑니다. 각 카드는 왜 보면 좋은지, 어디가 창작인지 나눕니다. 스트리밍 링크는 없습니다."
      />
      <ul className="mt-8 space-y-3">
        {movies.map((movie) => (
          <MovieCard key={movie.slug} movie={movie} />
        ))}
      </ul>
      <SisterCrossLinks title="다른 사이트의 영화" en="Films on sister sites" links={OTHER_FILMS} />
    </div>
  );
}
