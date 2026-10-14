export type GLink = { href: string; label: string };
export type GeneralKind = "legend" | "history" | "mixed";
export type General = {
  slug: string;
  nameKo: string;
  nameEn: string;
  native: string;
  years: string;
  era: string;
  kind: GeneralKind;
  ko: string;
  en: string;
  battles: readonly GLink[];
  films: readonly GLink[];
  rivals: readonly string[];
  allies: readonly string[];
  /** 확인이 어려운 일화. ‘전해지는 이야기’ 상자에 넣습니다. */
  tales: readonly string[];
  /** 같은 사이트 안의 인물·왕 페이지 */
  related: readonly GLink[];
  /** 다른 자매 사이트에서 같은 사람 보기 */
  cross: readonly GLink[];
  sources: readonly string[];
};
export type QuizItem = { q: string; options: readonly string[]; answer: number; why: string };
export const KIND_LABEL: Record<GeneralKind, string> = { legend: "전설", history: "역사", mixed: "역사+전설" };
