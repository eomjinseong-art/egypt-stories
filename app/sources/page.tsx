import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHead } from "@/components/PageHead";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "출처",
  description: "이집트이야기가 근거로 삼은 왕명표, 신전 명문, 헤로도토스, 플루타르코스와 현대 개설, 그리고 전설과 역사를 나누는 기준.",
  path: "/sources",
});

const ANCIENT = [
  ["팔레르모 석, 토리노 왕명표", "연대기 파편과 왕 목록", "이른 왕조의 뼈대입니다. 깨지고 비어 있어, 재위 햇수를 정확히 채울 수 없는 구간이 많습니다."],
  ["마네토", "『이집트사』(Aegyptiaca)", "기원전 3세기, 그리스어. 왕조라는 틀은 여기서 많이 왔습니다. 원문은 사라지고 후대 인용이 남았습니다."],
  ["피라미드 텍스트, 관 텍스트, 장례 주문", "무덤의 종교 글", "신의 이름과 내세 장면의 이른 조각입니다. ‘사자의 서’는 신왕국 모음집의 현대 이름입니다."],
  ["헤로도토스", "『역사』 2–3권", "기원전 5세기 그리스 여행기. 이집트를 길게 적지만, 보고 들은 것과 이집트인의 자랑이 섞입니다. 피라미드를 쌓은 시대보다 이천 년 뒤입니다."],
  ["플루타르코스", "『이시스와 오시리스에 대하여』, 『영웅전』", "서기 1–2세기. 오시리스 줄거리의 긴 서술과, 카이사르·안토니우스·알렉산드로스 전기. 도덕적 대비를 좋아합니다."],
  ["아리아노스, 디오도로스, 쿠르티우스", "알렉산드로스 전기", "이집트 입성과 시와 신탁. 신탁의 비밀 대답은 적혀 있지 않습니다."],
  ["카이사르 진영의 전쟁기, 카시우스 디오, 스트라본", "로마 내전과 이집트", "악티움과 기원전 30년. 스트라본은 클레오파트라의 죽음에 대해 두 전승을 함께 전합니다."],
  ["신전·무덤 명문", "나르메르 팔레트, 카르나크 연대기, 카데시 텍스트, 메디넷 하부, 아마르나 편지, 로제타 석", "각 글에서 이름으로 밝혔습니다. 왕의 벽은 승자의 공식 화면일 수 있습니다."],
];

const THINGS = [
  ["나르메르 팔레트", "히에라콘폴리스. 두 왕관과 적을 내리치는 장면."],
  ["사카라 계단식 피라미드, 기자 피라미드와 일꾼 마을", "고왕국 왕릉과 노동의 흔적. 상부 공간의 쿠푸 낙서."],
  ["기자 스핑크스와 투트모세 4세의 꿈의 비석", "상은 고왕국, 비석의 이야기는 신왕국."],
  ["카르나크, 데르 엘바하리, 아부심벨, 메디넷 하부", "신전과 전쟁의 공식 기록."],
  ["KV62", "투탕카멘의 무덤. 1922년 하워드 카터."],
  ["로제타 석", "기원전 196년. 신성문자, 데모틱, 그리스어."],
  ["아마르나 편지와 경계 비석", "아케나텐 시대의 외교와 새 수도."],
];

const MODERN = [
  ["이언 쇼 편", "The Oxford History of Ancient Egypt", "시대를 나누는 공동 개설. 이 사이트의 문장을 그 책에서 옮기지는 않았습니다."],
  ["토비 윌킨슨", "The Rise and Fall of Ancient Egypt (2010)", "일반 독자를 위한 통사."],
  ["배리 켐프", "Ancient Egypt: Anatomy of a Civilization", "도시, 신전, 경제를 구조로 보는 연구."],
  ["마크 판 더 미에롭", "A History of Ancient Egypt", "대학 개설로 널리 쓰입니다."],
  ["조이스 틸즐리", "Hatchepsut: The Female Pharaoh, Cleopatra: Last Queen of Egypt", "하트셉수트와 클레오파트라 전기."],
  ["케네스 키친", "Pharaoh Triumphant: The Life and Times of Ramesses II", "람세스 2세 연구."],
];

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { label: "출처" }]} />
      <PageHead
        kicker="SOURCES"
        title="출처"
        lead="이집트 역사는 왕의 벽, 나중에 쓴 그리스 사람, 그보다 더 나중의 요약이 겹칩니다. 이집트이야기는 가능한 한 기록의 이름과 위치를 밝히고, 그 기록이 언제 누구 편에서 쓰였는지를 같이 적습니다."
      />

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">적는 기준</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
          <li>전설, 역사, 둘이 섞인 글을 배지로 나눕니다. 나르메르와 메네스처럼 같은 사람인지 모르는 경우는 섞임으로 둡니다.</li>
          <li>고대 인물의 말풍선을 지어내지 않습니다. 신탁의 비밀 대답, 영화의 대사를 기록인 것처럼 적지 않습니다.</li>
          <li>플루타르코스에만 길게 나오는 신화 세부를 이집트 전국의 정본으로 올리지 않습니다.</li>
          <li>현대 연구서의 문장을 번역해 붙이지 않습니다. 책 이름만 입문 안내로 둡니다.</li>
          <li>출애굽은 신앙의 이야기로 존중하되, 특정 파라오의 연대기와 확인된 동일시처럼 적지 않습니다.</li>
          <li>영화를 볼 수 있는 불법 사이트는 안내하지 않습니다.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">고대 글</h2>
        <ul className="mt-3 space-y-3 text-sm leading-7">
          {ANCIENT.map(([author, work, note]) => (
            <li key={author}>
              <strong className="text-ink">{author}</strong> {work} — <span className="text-muted">{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">물건과 자리</h2>
        <ul className="mt-3 space-y-2 text-sm leading-7">
          {THINGS.map(([name, note]) => (
            <li key={name}>
              <strong className="text-ink">{name}</strong> — <span className="text-muted">{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">현대 입문서</h2>
        <ul className="mt-3 space-y-3 text-sm leading-7">
          {MODERN.map(([author, work, note]) => (
            <li key={author}>
              <strong className="text-ink">{author}</strong> {work} — <span className="text-muted">{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 text-sm leading-7 text-muted">
        <h2 className="font-serif text-base text-ink">표기</h2>
        <p className="mt-2">
          인명은 한국어에서 널리 쓰는 소리를 기준으로 했습니다. 쿠푸 옆에 케옵스처럼 그리스식 이름이 따로 있으면 그 사실을 적습니다. 아케나텐은 아케나톤으로도 씁니다. 람세스 2세와 3세는 다른 사람입니다.
        </p>
        <p className="mt-2">
          연도는 널리 쓰이는 교과서 눈금을 쓰되, 고왕국 이전과 제18왕조처럼 학설에 따라 몇 년에서 수십 년이 움직이는 구간은 그 사실을 적습니다. 오류가 있으면 고대 기록과 맞춰 고치면 됩니다.
        </p>
      </section>
    </div>
  );
}
