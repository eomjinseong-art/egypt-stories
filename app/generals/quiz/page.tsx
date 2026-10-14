import { CoupangCard } from "@/components/CoupangCard";
import { GCrumbs, GLinks } from "@/components/GLinks";
import { GENERALS_QUIZ } from "@/data/generals";
import { GENERALS_COUPANG, gMeta } from "@/lib/generals-meta";

export const metadata = gMeta("장군 퀴즈", `유명한 장군 퀴즈 ${GENERALS_QUIZ.length}문제.`, "/generals/quiz");

export default function GeneralsQuizPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <GCrumbs items={[{ href: "/", label: "홈" }, { href: "/generals", label: "장군" }, { label: "퀴즈" }]} />
      <h1 className="mt-4 font-serif text-3xl text-ink">장군 퀴즈</h1>
      <p className="mt-2 text-sm text-muted">답을 생각한 뒤 ‘정답 보기’를 눌러 보세요.</p>
      <ol className="mt-8 space-y-4">
        {GENERALS_QUIZ.map((q, i) => (
          <li key={q.q} className="rounded-lg border border-line bg-card p-4 text-sm leading-7">
            <p className="font-serif text-base text-ink">
              {i + 1}. {q.q}
            </p>
            <ol className="mt-1 list-[upper-alpha] pl-6">
              {q.options.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ol>
            <details className="mt-2">
              <summary className="cursor-pointer text-terra">정답 보기</summary>
              <p className="mt-1">
                <b>
                  {String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}
                </b>{" "}
                — {q.why}
              </p>
            </details>
          </li>
        ))}
      </ol>
      <GLinks title="이어서 보기" links={[{ href: "/generals", label: "장군 목록" }]} />
      <CoupangCard copy={GENERALS_COUPANG} />
    </div>
  );
}
