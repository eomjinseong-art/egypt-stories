import Link from "next/link";
import { moviesBySlugs, moviesByTopic } from "@/data/movies";
import type { Movie, MovieTopic } from "@/data/types";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <li id={movie.slug} className="scroll-mt-28 rounded-lg border border-line bg-card p-4">
      <p className="font-serif text-lg text-ink">
        「{movie.titleKo}」
        <span className="ml-2 font-sans text-sm font-normal text-muted">
          {movie.titleOriginal} · {movie.year} · {movie.kind}
        </span>
      </p>
      <p className="mt-2 text-sm leading-7">{movie.why}</p>
      <p className="mt-2 text-sm leading-7 text-muted">{movie.fiction}</p>
      {movie.links.length ? (
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {movie.links.map((link) =>
            link.href.startsWith("/") ? (
              <Link key={link.href} href={link.href} className="text-nile underline decoration-line underline-offset-4 hover:text-gold">
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className="text-nile underline decoration-line underline-offset-4 hover:text-gold" rel="noopener noreferrer">
                {link.label}
              </a>
            ),
          )}
        </p>
      ) : null}
    </li>
  );
}

export function RelatedMovies({
  topic,
  slugs,
}: {
  topic?: MovieTopic;
  slugs?: readonly string[];
}) {
  const list = slugs ? moviesBySlugs(slugs) : topic ? moviesByTopic(topic) : [];
  if (!list.length) return null;

  return (
    <section className="mt-10" aria-labelledby="related-movies-heading">
      <h2 id="related-movies-heading" className="font-serif text-2xl text-ink">
        관련 영화
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        아래 작품은 이집트를 무대로 한 극입니다. 분위기를 잡는 데는 도움이 되고, 사실 관계의 교과서는 아닙니다. 불법 영상 링크는 없습니다.
      </p>
      <ul className="mt-4 space-y-3">
        {list.map((movie) => (
          <MovieCard key={movie.slug} movie={movie} />
        ))}
      </ul>
      <Link href="/movies" className="mt-3 inline-block text-sm text-nile">
        추천 영화 전체 보기 →
      </Link>
    </section>
  );
}
