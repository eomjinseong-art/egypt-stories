export const SITE_NAME = "이집트이야기";
export const SITE_NAME_EN = "Egypt Stories";
export const SITE_TAGLINE = "어려운 이집트 역사를, 짧은 한국어로";
export const SITE_SUB =
  "선왕조에서 프톨레마이오스까지, 파라오와 나일강, 신전과 하루를 전설과 역사를 구분해 적습니다. 어려운 말에는 쉬운 풀이를 붙입니다.";
export const BRAND_LINE = "나두 — 나의 모든 일상을 AI와 함께";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://egypt-stories.vercel.app";

export const MYTH_URL = "https://nadoo-myth.vercel.app";
export const MYTH_NAME = "나두신화";

export const ILIAD_URL = "https://iliad-stories.vercel.app";
export const ILIAD_NAME = "일리아스이야기";

export const ROME_URL = "https://rome-stories.vercel.app";
export const ROME_NAME = "로마이야기";

export const GREECE_URL = "https://greece-stories.vercel.app";
export const GREECE_NAME = "그리스이야기";

export const PERSIA_URL = "https://persia-stories.vercel.app";
export const PERSIA_NAME = "페르시아이야기";

export const CHOSEN_URL = "https://the-chosen-korean.vercel.app";
export const CHOSEN_NAME = "더 초즌 · 성경";

export const PHILOSOPHY_URL = "https://philosophy-stories.vercel.app";
export const PHILOSOPHY_NAME = "철학이야기";

export const KOREA_URL = "https://korea-stories.vercel.app";
export const KOREA_NAME = "대한민국이야기";

export const TIMELINE_URL = "https://nadoo-timeline.vercel.app";
export const TIMELINE_NAME = "나두연표";

export const HUB_URL = "https://tinalinkeom.vercel.app";
export const HUB_NAME = "나두 허브";

export const COUPANG_URL = "https://link.coupang.com/a/hsdzLh1vB6";

/** Shared label for the sister-site group, matching 나두신화. */
export const FAMILY_LABEL = "나두 역사·신화";

/**
 * Sister origins, including this site. iliad-stories is shipping in parallel and
 * may 404 until that deploy is live. Link checks must allow the origin and must not fetch it.
 */
export const SISTER_ORIGINS = [
  MYTH_URL,
  ILIAD_URL,
  GREECE_URL,
  ROME_URL,
  SITE_URL,
  PERSIA_URL,
  CHOSEN_URL,
  PHILOSOPHY_URL,
  KOREA_URL,
  TIMELINE_URL,
  HUB_URL,
] as const;

export function sisterOriginAllowed(href: string) {
  try {
    return (SISTER_ORIGINS as readonly string[]).includes(new URL(href).origin);
  } catch {
    return false;
  }
}

export const SISTERS = [
  {
    href: MYTH_URL,
    name: MYTH_NAME,
    en: "Myth",
    desc: "그리스·로마 신화. 이집트 신과 이름이 겹치는 곳만 여기서 잇습니다.",
  },
  {
    href: ILIAD_URL,
    name: ILIAD_NAME,
    en: "Iliad",
    desc: "일리아스의 51일. 트로이 전쟁 이야기이고, 이집트와 직접 겹치는 장면은 적습니다.",
  },
  {
    href: GREECE_URL,
    name: GREECE_NAME,
    en: "Greece",
    desc: "알렉산드로스와 그리스 세계. 이집트 입성은 그 길의 한 구간입니다.",
  },
  {
    href: ROME_URL,
    name: ROME_NAME,
    en: "Rome",
    desc: "클레오파트라, 카이사르, 악티움. 이집트가 로마의 곡물 창고가 된 뒤의 정치.",
  },
  {
    href: PERSIA_URL,
    name: PERSIA_NAME,
    en: "Persia",
    desc: "캄비세스의 정복과 알렉산드로스. 이집트가 페르시아의 속주였던 시간입니다.",
  },
  {
    href: CHOSEN_URL,
    name: CHOSEN_NAME,
    en: "The Chosen · Bible",
    desc: "출애굽기와 성경 이야기. 영화 속 파라오와 성경의 파라오를 구분해서 잇습니다.",
  },
  {
    href: PHILOSOPHY_URL,
    name: PHILOSOPHY_NAME,
    en: "Philosophy",
    desc: "알렉산드리아의 히파티아. 그리스계 도시에서 이어진 학문입니다.",
  },
  {
    href: KOREA_URL,
    name: KOREA_NAME,
    en: "Korea",
    desc: "같은 해의 한반도. 피라미드 시대와 삼국을 나란히 보는 비교입니다.",
  },
  {
    href: TIMELINE_URL,
    name: TIMELINE_NAME,
    en: "Timeline",
    desc: "세계사 vs 한반도 비교 연표. 피라미드를 쌓던 해에 한반도에서는 무슨 일이 있었는지.",
  },
  {
    href: HUB_URL,
    name: HUB_NAME,
    en: "Nadoo Hub",
    desc: "나두 역사·신화 사이트의 모음입니다.",
  },
] as const;

/** Shared row A. This site's own family tree is omitted. */
export const OTHER_FAMILY_TREES = [
  { href: `${ROME_URL}/family-tree`, label: "로마이야기 가족관계도", en: "Rome" },
  { href: `${GREECE_URL}/family-tree`, label: "그리스이야기 가족관계도", en: "Greece" },
  { href: `${PERSIA_URL}/family-tree`, label: "페르시아이야기 가족관계도", en: "Persia" },
  { href: `${KOREA_URL}/family-tree`, label: "대한민국이야기 가족관계도", en: "Korea" },
  { href: `${MYTH_URL}/family-tree`, label: "나두신화 가족관계도", en: "Myth" },
  { href: `${CHOSEN_URL}/family-tree`, label: "더 초즌 가족관계도", en: "The Chosen" },
] as const;

/** Shared row B. This site's own film list is omitted. */
export const OTHER_FILMS = [
  { href: `${ROME_URL}/movies`, label: "로마이야기 영화", en: "Rome" },
  { href: `${GREECE_URL}/movies`, label: "그리스이야기 영화", en: "Greece" },
  { href: `${PERSIA_URL}/movies`, label: "페르시아이야기 영화", en: "Persia" },
  { href: `${KOREA_URL}/films`, label: "대한민국이야기 영화", en: "Korea" },
  { href: `${PHILOSOPHY_URL}/films`, label: "철학이야기 영화", en: "Philosophy" },
  { href: `${MYTH_URL}/in-media`, label: "나두신화 속 영화", en: "Myth" },
  { href: `${CHOSEN_URL}/together`, label: "더 초즌 · 함께 보기", en: "The Chosen" },
] as const;

export const NAV = [
  { href: "/origins", label: "시대" },
  { href: "/map", label: "지도" },
  { href: "/rulers", label: "파라오" },
  { href: "/family-tree", label: "가족관계도" },
  { href: "/cleopatra", label: "클레오파트라" },
  { href: "/gods", label: "신" },
  { href: "/daily", label: "일상" },
  { href: "/monuments", label: "유적" },
  { href: "/wars", label: "전쟁" },
  { href: "/movies", label: "영화" },
  { href: "/sources", label: "출처" },
] as const;

export const HOME_SECTIONS = [
  {
    href: "/origins",
    en: "Origins",
    title: "시대",
    desc: "선왕조에서 고·중·신왕국, 후기, 프톨레마이오스까지. 삼천 년을 여섯 칸으로 나눕니다.",
  },
  {
    href: "/map",
    en: "Places",
    title: "나일강과 지도",
    desc: "강은 남에서 북으로 흐릅니다. 상이집트가 남쪽인 이유, 멤피스·테베·알렉산드리아.",
  },
  {
    href: "/rulers",
    en: "Pharaohs",
    title: "파라오",
    desc: "쿠푸, 하트셉수트, 아케나텐, 투탕카멘, 람세스 2세, 클레오파트라 7세 등 길을 잡는 열두 사람.",
  },
  {
    href: "/family-tree",
    en: "Family Tree",
    title: "가족관계도",
    desc: "신화의 신들, 18·19왕조, 프톨레마이오스 가계. 확실한 혈연과 다투는 혈연을 선으로 나눕니다.",
  },
  {
    href: "/cleopatra",
    en: "Cleopatra",
    title: "클레오파트라와 로마",
    desc: "프톨레마이오스 왕조의 마지막 통치자, 카이사르와 안토니우스, 곡물과 악티움.",
  },
  {
    href: "/gods",
    en: "Gods",
    title: "신",
    desc: "라, 아문, 오시리스, 이시스, 호루스. 그리스 이름과 겹치면 나두신화로 넘어갑니다.",
  },
  {
    href: "/daily",
    en: "Daily Life",
    title: "일상",
    desc: "범람과 농사, 상형문자, 신전, 내세. 영화의 저주가 아니라 사람들이 믿던 질서.",
  },
  {
    href: "/monuments",
    en: "Monuments",
    title: "피라미드·신전·무덤",
    desc: "왜 쌓았는지, 어떻게 쌓았는지 아는 것과 모르는 것, 전설과 발굴을 나눕니다.",
  },
  {
    href: "/wars",
    en: "Wars",
    title: "전쟁",
    desc: "힉소스, 카데시, 바다 민족, 아시리아, 페르시아, 알렉산드로스, 로마. 짧게.",
  },
  {
    href: "/movies",
    en: "Films",
    title: "관련 영화",
    desc: "미이라, 클레오파트라, 이집트 왕자, 출애굽 영화, 사카라 발굴 다큐멘터리. 어디가 창작인지 같이 적습니다.",
  },
  {
    href: "/sources",
    en: "Sources",
    title: "출처",
    desc: "왕명표, 신전 명문, 헤로도토스, 플루타르코스와 현대 개설. 없는 말은 만들지 않습니다.",
  },
] as const;
