import Link from "next/link";
import { CoupangBanner } from "@/components/CoupangBanner";
import { SisterLinkList } from "@/components/SisterLinks";
import { BRAND_LINE, NAV, SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-stone/80">
      <CoupangBanner />
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm leading-6 text-muted">
        <p className="font-serif text-base text-ink">{SITE_NAME}</p>
        <p className="mt-1 text-xs tracking-wide text-gold">{BRAND_LINE}</p>
        <div className="mt-4 max-w-3xl space-y-2">
          <p>
            이집트이야기의 글은 왕명표, 신전 명문, 무덤 기록, 헤로도토스와 플루타르코스 같은 고대 기록과 공개된 연구 정리를 참고해 우리말로 다시 쓴 것입니다. 고대 문장이나 현대 책의 문장을 그대로 옮기지 않았고, 없는 말을 만들어 넣지 않았습니다.
          </p>
          <p>전설은 전설이라고 적습니다. 영화 제목과 상표는 각 권리자의 것입니다. 영화를 볼 수 있는 불법 사이트는 안내하지 않습니다.</p>
        </div>
        <SisterLinkList />
        <nav aria-label="사이트 메뉴" className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
          <Link href="/" className="underline decoration-line underline-offset-4 hover:text-nile">
            홈
          </Link>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="underline decoration-line underline-offset-4 hover:text-nile">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
