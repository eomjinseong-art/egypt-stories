export const SITE_NAME = "이집트이야기";
export const SITE_NAME_EN = "Egypt Stories";
export const SITE_TAGLINE = "어려운 이집트 역사를, 짧은 한국어로";
export const SITE_SUB =
  "선왕조에서 프톨레마이오스까지, 파라오와 나일강, 신전과 하루를 전설과 역사를 구분해 적습니다. 어려운 말에는 쉬운 풀이를 붙입니다.";
export const BRAND_LINE = "나두 — 나의 모든 일상을 AI와 함께";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://egypt-stories.vercel.app";

export const MYTH_URL = "https://nadoo-myth.vercel.app";
export const MYTH_NAME = "나두신화";

export const ROME_URL = "https://rome-stories.vercel.app";
export const ROME_NAME = "로마이야기";

export const GREECE_URL = "https://greece-stories.vercel.app";
export const GREECE_NAME = "그리스이야기";

export const COUPANG_URL = "https://link.coupang.com/a/hsdzLh1vB6";

/** Shared label for the sister-site group, matching 나두신화. */
export const FAMILY_LABEL = "나두 역사·신화";

export const SISTERS = [
  {
    href: MYTH_URL,
    name: MYTH_NAME,
    en: "Myth",
    desc: "그리스·로마 신화. 이집트 신과 이름이 겹치는 곳만 여기서 잇습니다.",
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
] as const;

export const NAV = [
  { href: "/origins", label: "시대" },
  { href: "/map", label: "지도" },
  { href: "/rulers", label: "파라오" },
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
