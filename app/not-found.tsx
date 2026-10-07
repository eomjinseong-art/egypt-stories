import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs tracking-[0.2em] text-gold">404</p>
      <h1 className="mt-2 font-serif text-3xl text-ink">이 주소는 지도에 없습니다</h1>
      <p className="mt-3 text-sm leading-7 text-muted">강가로 돌아가 다른 길을 고르세요.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <Link href="/" className="text-nile underline">
          홈
        </Link>
        <Link href="/rulers" className="text-nile underline">
          파라오
        </Link>
        <Link href="/map" className="text-nile underline">
          지도
        </Link>
      </div>
    </div>
  );
}
