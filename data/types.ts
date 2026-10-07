export type Source = { work: string; ref?: string };

export type Kind = "legend" | "history" | "mixed";

export type LinkItem = { href: string; label: string };

export type Guide = {
  en: string;
  title: string;
  summary: string;
  points: readonly [string, string, string];
  more: readonly string[];
};

export type MovieTopic = "origins" | "rulers" | "cleopatra" | "wars" | "monuments" | "daily" | "gods";

export type Movie = {
  slug: string;
  titleKo: string;
  titleOriginal: string;
  year: string;
  kind: "영화" | "애니메이션" | "다큐멘터리";
  platform?: string;
  why: string;
  fiction: string;
  topics: readonly MovieTopic[];
  links: readonly LinkItem[];
};

export type RulerGroup = "early" | "middle" | "new" | "late";

export type Ruler = Guide & {
  slug: string;
  group: RulerGroup;
  nameKo: string;
  nameEn: string;
  egyptian: string;
  years: string;
  kind: Kind;
  sources: readonly Source[];
  movieSlugs: readonly string[];
  related: readonly LinkItem[];
};

export type War = Guide & {
  slug: string;
  years: string;
  cause: string;
  who: string;
  result: string;
  sources: readonly Source[];
  movieSlugs: readonly string[];
  related: readonly LinkItem[];
};

export type Place = Guide & {
  id: string;
  links?: readonly LinkItem[];
};

export type Region = {
  id: string;
  en: string;
  title: string;
  lead: string;
  places: readonly Place[];
};

export type GodCard = {
  slug: string;
  en: string;
  nameKo: string;
  egyptian: string;
  summary: string;
  note: string;
  links: readonly LinkItem[];
};
