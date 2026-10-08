/**
 * 가족관계도 (Family Tree).
 *
 * 신왕국 재위 연대의 ‘약’은 이언 쇼 편 『옥스퍼드 고대 이집트사』(2000) 연대표를 따릅니다.
 * 프톨레마이오스 왕조의 해는 그리스 사료의 재위입니다. 혈연이 기록으로 닫히지 않으면
 * `variantParent()` 또는 `variantSpouse()`로 잇고, 칸의 note에 이유를 적습니다.
 *
 * col은 가계도 전체에서 같은 세로줄입니다. 같은 가로줄에서는 col 차이를 1.2 이상으로 둡니다.
 */

import { ROME_URL } from "@/lib/site";

export type TreeId = "myth" | "d18" | "d19" | "ptolemy";
export type LinkKind = "parent" | "spouse" | "variant-parent" | "variant-spouse";

export type TreeSeed = {
  id: string;
  ko: string;
  roman: string;
  band: string;
  /** Horizontal slot. The same number lines up across generations. */
  col: number;
  /** Absolute top of the card, in pixels. */
  y: number;
  href?: string;
  guestTag?: string;
  /** Short label under the English name. Reigns are BCE. */
  years?: string;
  caption?: string;
  summary: string;
  note?: string;
  badge?: string;
  aliases?: string[];
};

export type TreeLink = { from: string; to: string; kind: LinkKind };

export type BandMeta = {
  id: string;
  ko: string;
  en: string;
  hint: string;
  color: string;
  soft: string;
};

export type Dispute = { id: string; title: string; main: string; other: string };
export type NameNote = { title: string; body: string };

const COL = 136;
const NODE_W = 124;
const NODE_H = 104;
const PAD = 28;
const ROW = 196;

function y(row: number) {
  return 72 + row * ROW;
}

export type LayoutNode = TreeSeed & {
  x: number;
  y: number;
  w: number;
  h: number;
  sub: string;
  line: string;
  href?: string;
  keys: string[];
};

export type LayoutEdge = {
  id: string;
  d: string;
  d2?: string;
  kind: LinkKind;
  from: string;
  to: string;
  local: boolean;
  quiet: boolean;
};

export type LayoutBand = BandMeta & {
  top: number;
  height: number;
  nodeIds: string[];
};

export type FamilyTreeLayout = {
  id: TreeId;
  width: number;
  height: number;
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  bands: LayoutBand[];
  links: TreeLink[];
  byId: Map<string, LayoutNode>;
};

export type FamilyChart = {
  id: TreeId;
  ko: string;
  en: string;
  kind: "legend" | "history";
  lead: string;
  disputes: readonly Dispute[];
  notes: readonly NameNote[];
  layout: FamilyTreeLayout;
};

type Box = { id: string; x: number; y: number; w: number; h: number; cx: number; cy: number };

function norm(value: string) {
  return value.toLowerCase().replace(/[\s·.'’\-()/_]/g, "");
}

export function formatYears(years?: string) {
  if (!years) return "";
  if (years.startsWith("생몰 ")) return `생몰 기원전 ${years.slice(3)}`;
  if (years.startsWith("약 ") || /^\d/.test(years) || years.endsWith("년생")) return `기원전 ${years}`;
  return years;
}

function subLine(seed: TreeSeed) {
  return seed.roman;
}

function captionFor(seed: TreeSeed, links: TreeLink[], byId: Map<string, TreeSeed>) {
  if (seed.caption) return seed.caption;
  if (seed.years) return seed.years;
  const names = links
    .filter((link) => link.to === seed.id && link.kind === "parent")
    .map((link) => byId.get(link.from)?.ko)
    .filter((name): name is string => Boolean(name));
  return names.join("·");
}

function placeNodes(seeds: TreeSeed[], links: TreeLink[]): { nodes: LayoutNode[]; width: number; height: number } {
  const cols = seeds.map((seed) => seed.col);
  const globalMin = Math.min(...cols);
  const globalMax = Math.max(...cols);
  const width = (globalMax - globalMin) * COL + NODE_W + PAD * 2;
  const seedById = new Map(seeds.map((seed) => [seed.id, seed]));
  const nodes: LayoutNode[] = seeds.map((seed) => {
    const keys = [seed.ko, seed.roman, seed.id, seed.guestTag, ...(seed.aliases ?? [])].filter((key): key is string => Boolean(key));
    return {
      ...seed,
      x: PAD + (seed.col - globalMin) * COL,
      w: NODE_W,
      h: NODE_H,
      sub: subLine(seed),
      line: captionFor(seed, links, seedById) || "\u00a0",
      keys,
    };
  });
  const height = Math.max(...nodes.map((node) => node.y + node.h)) + 36;
  return { nodes, width, height };
}

function boxes(nodes: LayoutNode[]): Box[] {
  return nodes.map((node) => ({
    id: node.id,
    x: node.x,
    y: node.y,
    w: node.w,
    h: node.h,
    cx: node.x + node.w / 2,
    cy: node.y + node.h / 2,
  }));
}

function edgePaths(nodes: LayoutNode[], links: TreeLink[]): LayoutEdge[] {
  const box = new Map(boxes(nodes).map((item) => [item.id, item]));
  return links.map((link) => {
    const from = box.get(link.from)!;
    const to = box.get(link.to)!;
    const path = link.kind === "spouse" || link.kind === "variant-spouse" ? spousePath(from, to) : directedPath(from, to, link.kind);
    const dx = Math.abs(from.cx - to.cx);
    const dy = Math.abs(from.cy - to.cy);
    const local =
      link.kind === "spouse" || link.kind === "variant-spouse" ? dx < COL * 1.6 && dy < NODE_H * 1.4 : dx < COL * 2.2 && dy < 240;
    return {
      id: `${link.kind}-${link.from}-${link.to}`,
      d: path.d,
      d2: path.d2,
      kind: link.kind,
      from: link.from,
      to: link.to,
      local,
      quiet: Math.hypot(dx, dy) > 640,
    };
  });
}

function directedPath(from: Box, to: Box, kind: LinkKind): { d: string; d2?: string } {
  const downward = from.cy <= to.cy;
  const x1 = from.cx;
  const y1 = downward ? from.y + from.h : from.y;
  const x2 = to.cx;
  const y2 = downward ? to.y : to.y + to.h;
  const sameRow = Math.abs(from.cy - to.cy) < 24;
  if (sameRow && kind === "variant-parent") {
    const left = Math.min(x1, x2);
    const right = Math.max(x1, x2);
    const y = Math.min(from.y, to.y);
    return { d: `M ${left} ${y} Q ${(left + right) / 2} ${y - 26}, ${right} ${y}` };
  }
  if (Math.abs(x1 - x2) < 6) return { d: `M ${x1} ${y1} V ${y2}` };
  const mid = (y1 + y2) / 2;
  return { d: `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}` };
}

function spousePath(a: Box, b: Box): { d: string; d2?: string } {
  const left = a.cx <= b.cx ? a : b;
  const right = a.cx <= b.cx ? b : a;
  const x1 = left.x + left.w;
  const x2 = right.x;
  const gap = x2 - x1;
  if (Math.abs(a.cy - b.cy) < 24 && gap < COL * 0.85) {
    const midY = (left.cy + right.cy) / 2;
    return { d: `M ${x1} ${midY - 2.5} H ${x2}`, d2: `M ${x1} ${midY + 2.5} H ${x2}` };
  }
  if (Math.abs(a.cy - b.cy) < 24) {
    const top = left.y;
    const mid = (left.cx + right.cx) / 2;
    const lift = Math.min(36, 16 + Math.abs(right.cx - left.cx) * 0.04);
    return { d: `M ${left.cx} ${top} Q ${mid} ${top - lift}, ${right.cx} ${top}` };
  }
  const upper = a.cy <= b.cy ? a : b;
  const lower = a.cy <= b.cy ? b : a;
  const sx = upper.cx;
  const sy = upper.y + upper.h;
  const tx = lower.cx;
  const ty = lower.y;
  const mid = (sy + ty) / 2;
  const bow = sx <= tx ? 36 : -36;
  return { d: `M ${sx} ${sy} C ${sx + bow} ${mid}, ${tx + bow} ${mid}, ${tx} ${ty}` };
}

function assertCols(seeds: TreeSeed[]) {
  const rows = new Map<number, TreeSeed[]>();
  for (const seed of seeds) {
    const list = rows.get(seed.y) ?? [];
    list.push(seed);
    rows.set(seed.y, list);
  }
  for (const group of rows.values()) {
    const sorted = [...group].sort((a, b) => a.col - b.col);
    for (let i = 1; i < sorted.length; i += 1) {
      if (sorted[i].col - sorted[i - 1].col < 1.19) {
        throw new Error(`가족관계도 가로 간격이 좁습니다: ${sorted[i - 1].id} · ${sorted[i].id}`);
      }
    }
  }
}

function validate(nodes: LayoutNode[], links: TreeLink[], bands: LayoutBand[], id: TreeId) {
  const ids = new Set<string>();
  for (const node of nodes) {
    if (ids.has(node.id)) throw new Error(`가족관계도 id 중복: ${id} ${node.id}`);
    ids.add(node.id);
  }
  const edgeIds = new Set<string>();
  for (const link of links) {
    if (!ids.has(link.from) || !ids.has(link.to)) {
      throw new Error(`가족관계도 선 오류: ${id} ${link.kind} ${link.from} → ${link.to}`);
    }
    const edgeId = `${link.kind}-${link.from}-${link.to}`;
    if (edgeIds.has(edgeId)) throw new Error(`가족관계도 선 중복: ${id} ${edgeId}`);
    edgeIds.add(edgeId);
  }
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (overlapX > 4 && overlapY > 4) throw new Error(`가족관계도 칸이 겹칩니다: ${id} ${a.id} · ${b.id}`);
      if (a.band !== b.band || overlapX < 12) continue;
      const upper = a.y <= b.y ? a : b;
      const lower = a.y <= b.y ? b : a;
      const gap = lower.y - (upper.y + upper.h);
      if (gap < 0 || gap > 72) continue;
      const related = links.some((link) => (link.from === a.id && link.to === b.id) || (link.from === b.id && link.to === a.id));
      if (!related) throw new Error(`위아래가 어긋납니다: ${id} ${upper.id} 아래 ${lower.id}`);
    }
  }
  for (let i = 1; i < bands.length; i += 1) {
    const gap = bands[i].top - (bands[i - 1].top + bands[i - 1].height);
    if (gap < 12) throw new Error(`세대 간격이 좁습니다: ${id} ${bands[i - 1].id} → ${bands[i].id}`);
  }
}

function buildBands(nodes: LayoutNode[], meta: readonly BandMeta[]): LayoutBand[] {
  return meta.map((band) => {
    const group = nodes.filter((node) => node.band === band.id).sort((a, b) => a.y - b.y || a.x - b.x);
    if (!group.length) throw new Error(`빈 세대: ${band.id}`);
    const top = Math.min(...group.map((node) => node.y)) - 52;
    const bottom = Math.max(...group.map((node) => node.y + node.h)) + 18;
    return { ...band, top, height: bottom - top, nodeIds: group.map((node) => node.id) };
  });
}

function layoutChart(chartId: TreeId, seeds: TreeSeed[], links: TreeLink[], meta: readonly BandMeta[]): FamilyTreeLayout {
  assertCols(seeds);
  const placed = placeNodes(seeds, links);
  const bands = buildBands(placed.nodes, meta);
  validate(placed.nodes, links, bands, chartId);
  return {
    id: chartId,
    width: placed.width,
    height: placed.height,
    nodes: placed.nodes,
    edges: edgePaths(placed.nodes, links),
    bands,
    links,
    byId: new Map(placed.nodes.map((node) => [node.id, node])),
  };
}

function hasLink(links: TreeLink[], kind: LinkKind, from: string, to: string) {
  return links.some((link) => link.kind === kind && link.from === from && link.to === to);
}

function assertLink(links: TreeLink[], kind: LinkKind, from: string, to: string) {
  if (!hasLink(links, kind, from, to)) throw new Error(`필요한 선이 없습니다: ${kind} ${from} → ${to}`);
}

function assertNoLink(links: TreeLink[], kind: LinkKind, from: string, to: string) {
  if (hasLink(links, kind, from, to)) throw new Error(`있으면 안 되는 선: ${kind} ${from} → ${to}`);
}

const MYTH_BANDS: BandMeta[] = [
  {
    id: "creator",
    ko: "창조",
    en: "Creator",
    hint: "헬리오폴리스에서 아툼은 처음 신이고, 태양신 라와 한 신으로 겹칩니다. 슈와 테프누트는 짝 없이 난 남매입니다.",
    color: "#3e4d7a",
    soft: "#e7edf7",
  },
  {
    id: "earth",
    ko: "땅과 하늘",
    en: "Earth and sky",
    hint: "게브와 누트는 슈와 테프누트의 자녀이자 부부입니다.",
    color: "#0f5e5c",
    soft: "#e5f3f2",
  },
  {
    id: "siblings",
    ko: "오시리스의 형제",
    en: "Children of Geb",
    hint: "게브와 누트의 네 자녀입니다. 오시리스와 이시스, 세트와 네프티스가 각각 부부입니다.",
    color: "#8a6420",
    soft: "#f8f1e2",
  },
  {
    id: "next",
    ko: "다음 세대",
    en: "Next generation",
    hint: "호루스는 오시리스와 이시스의 아들로 그렸습니다. 아누비스의 부모는 점선입니다.",
    color: "#6d4c8a",
    soft: "#f3eef8",
  },
];

const MYTH_DISPUTES: Dispute[] = [
  {
    id: "anubis",
    title: "아누비스의 부모",
    main: "이집트 신전의 글은 아누비스의 부모를 한 쌍으로 닫지 않습니다. 그래서 금색 실선을 긋지 않았습니다.",
    other: "플루타르코스 『이시스와 오시리스에 대하여』는 오시리스와 네프티스의 아들이고 이시스가 키웠다고 전합니다. 세트와 네프티스의 아들로 두는 정리도 있습니다. 점선 세 줄은 그 두 전승을 겹쳐 둔 것이고, 세 신이 동시에 부모라는 뜻은 아닙니다.",
  },
  {
    id: "horus",
    title: "호루스가 둘처럼 보이는 이유",
    main: "이 그림의 호루스는 오시리스와 이시스의 아들입니다. 살아있는 왕과 연결되고, 아이가 된 뒤에는 하르포크라테스라고도 불립니다.",
    other: "큰 호루스(하로에리스)를 게브와 누트의 아들로, 오시리스의 형제 세대에 두는 전승이 있습니다. 같은 칸에 두 신을 겹치지 않으려고 그 선은 그리지 않았습니다.",
  },
  {
    id: "atum-ra",
    title: "아툼과 라",
    main: "창조 이야기의 아툼과 태양의 라는 출발이 다릅니다. 헬리오폴리스에서는 둘이 아툼-라로 겹칩니다.",
    other: "부모와 자녀로 잇지 않았습니다. 이 사이트의 라 소개로 넘어갑니다.",
  },
];

const MYTH_NOTES: NameNote[] = [
  {
    title: "이 탭은 신화",
    body: "엔네아드는 헬리오폴리스가 세운 아홉 신의 가계입니다. 도시와 세기마다 다른 신이 앞자리에 섭니다. 플루타르코스의 긴 줄거리를 이집트 전국의 정본으로 읽지 않습니다.",
  },
  {
    title: "세트",
    body: "호루스의 적이기도 하고, 어떤 주문에서는 태양의 배를 지키는 쪽에 서기도 합니다. 가계도의 자리와 별개입니다.",
  },
];

function mythLinks(): TreeLink[] {
  const links: TreeLink[] = [];
  const parent = (from: string, to: string) => links.push({ from, to, kind: "parent" });
  const parents = (child: string, ...from: string[]) => from.forEach((id) => parent(id, child));
  const spouse = (a: string, b: string) => links.push({ from: a, to: b, kind: "spouse" });
  const variantParent = (from: string, to: string) => links.push({ from, to, kind: "variant-parent" });

  parent("atum-ra", "shu");
  parent("atum-ra", "tefnut");
  spouse("shu", "tefnut");
  parents("geb", "shu", "tefnut");
  parents("nut", "shu", "tefnut");
  spouse("geb", "nut");
  for (const id of ["osiris", "isis", "seth", "nephthys"]) parents(id, "geb", "nut");
  spouse("osiris", "isis");
  spouse("seth", "nephthys");
  parents("horus", "osiris", "isis");
  variantParent("osiris", "anubis");
  variantParent("nephthys", "anubis");
  variantParent("seth", "anubis");

  assertLink(links, "parent", "atum-ra", "shu");
  assertLink(links, "parent", "osiris", "horus");
  assertLink(links, "parent", "isis", "horus");
  assertNoLink(links, "parent", "osiris", "anubis");
  assertNoLink(links, "parent", "seth", "anubis");
  return links;
}

const MYTH_SEEDS: TreeSeed[] = [
  {
    id: "atum-ra",
    ko: "아툼-라",
    roman: "Atum-Ra",
    band: "creator",
    col: 2.4,
    y: y(0),
    href: "/gods#ra",
    caption: "창조신",
    summary: "헬리오폴리스 창조에서 아툼은 맨 처음 신입니다. 태양신 라와 한 신으로 겹쳐 아툼-라로 불리고, 슈와 테프누트를 짝 없이 낳습니다.",
    aliases: ["atum", "ra", "아툼", "라", "아툼라", "레", "re"],
  },
  {
    id: "shu",
    ko: "슈",
    roman: "Shu",
    band: "creator",
    col: 1.8,
    y: y(1),
    summary: "공기입니다. 아툼의 아들이고 테프누트의 남편이며, 게브와 누트의 아버지입니다.",
    aliases: ["shu", "슈"],
  },
  {
    id: "tefnut",
    ko: "테프누트",
    roman: "Tefnut",
    band: "creator",
    col: 3.0,
    y: y(1),
    summary: "수분과 이슬 쪽으로 풀이되는 여신입니다. 슈의 짝이고 게브와 누트의 어머니입니다.",
    aliases: ["tefnut", "테프누트"],
  },
  {
    id: "geb",
    ko: "게브",
    roman: "Geb",
    band: "earth",
    col: 1.8,
    y: y(2),
    summary: "땅의 신입니다. 누트의 남편이고, 오시리스·이시스·세트·네프티스의 아버지입니다.",
    aliases: ["geb", "seb", "게브", "셉"],
  },
  {
    id: "nut",
    ko: "누트",
    roman: "Nut",
    band: "earth",
    col: 3.0,
    y: y(2),
    summary: "하늘의 여신입니다. 게브의 아내이고 그 네 자녀의 어머니입니다.",
    aliases: ["nut", "누트", "누트여신"],
  },
  {
    id: "osiris",
    ko: "오시리스",
    roman: "Osiris",
    band: "siblings",
    col: 0.2,
    y: y(3),
    href: "/gods#osiris",
    summary: "죽은 자의 왕으로 널리 모셔졌습니다. 이시스의 남편이고, 이 그림에서는 호루스의 아버지입니다.",
    aliases: ["osiris", "오시리스"],
  },
  {
    id: "isis",
    ko: "이시스",
    roman: "Isis",
    band: "siblings",
    col: 1.4,
    y: y(3),
    href: "/gods#isis",
    summary: "오시리스의 짝이고 호루스의 어머니로 자주 나옵니다. 보호와 주문이 큰 역할입니다.",
    aliases: ["isis", "이시스"],
  },
  {
    id: "seth",
    ko: "세트",
    roman: "Seth",
    band: "siblings",
    col: 3.0,
    y: y(3),
    href: "/gods#seth",
    summary: "사막과 폭풍의 신입니다. 네프티스의 남편이고, 호루스와 왕위를 다투는 상대로 자주 나옵니다.",
    aliases: ["seth", "set", "세트", "셋"],
  },
  {
    id: "nephthys",
    ko: "네프티스",
    roman: "Nephthys",
    band: "siblings",
    col: 4.2,
    y: y(3),
    summary: "세트의 짝으로 자주 나옵니다. 아누비스의 어머니로 두는 전승이 있어 점선으로 이어 둡니다.",
    aliases: ["nephthys", "nebthys", "네프티스", "넵티스"],
  },
  {
    id: "horus",
    ko: "호루스",
    roman: "Horus",
    band: "next",
    col: 0.8,
    y: y(4),
    href: "/gods#horus",
    summary: "오시리스와 이시스의 아들로 보통 이야기합니다. 살아있는 왕이 이 신과 연결되었습니다.",
    note: "큰 호루스를 게브와 누트의 아들로 두는 전승은 다른 신으로 보고, 이 칸에 합치지 않았습니다.",
    aliases: ["horus", "harpocrates", "호루스", "호루수", "하르포크라테스"],
  },
  {
    id: "anubis",
    ko: "아누비스",
    roman: "Anubis",
    band: "next",
    col: 3.6,
    y: y(4),
    href: "/gods#anubis",
    badge: "다른 전승",
    summary: "무덤과 방부(몸을 보존하는 일)의 신입니다. 부모를 한 쌍으로 확정하지 않습니다.",
    note: "한 전승은 오시리스와 네프티스, 다른 전승은 세트와 네프티스입니다. 점선은 그 갈림입니다.",
    aliases: ["anubis", "아누비스", "아누비스신"],
  },
];

const D18_BANDS: BandMeta[] = [
  {
    id: "ahmose",
    ko: "아흐모세 집안",
    en: "Ahmose",
    hint: "제18왕조의 시작입니다. 투트모세 1세는 다음 왕이지만, 아멘호테프 1세의 아들인지는 확인되지 않습니다.",
    color: "#0f5e5c",
    soft: "#e5f3f2",
  },
  {
    id: "thutmose",
    ko: "투트모세",
    en: "Thutmosids",
    hint: "하트셉수트는 투트모세 2세의 배후이자 이복 오라비의 아내입니다. 투트모세 3세의 어머니는 이세트입니다.",
    color: "#8a6420",
    soft: "#f8f1e2",
  },
  {
    id: "amenhotep",
    ko: "아멘호테프",
    en: "Amenhoteps",
    hint: "아멘호테프 2세와 투트모세 4세는 3세에서 아멘호테프 3세로 가는 부자 관계입니다. 세대를 건너뛰지 않으려고 넣었습니다.",
    color: "#3e4d7a",
    soft: "#e7edf7",
  },
  {
    id: "amarna",
    ko: "아마르나와 그 뒤",
    en: "Amarna",
    hint: "투탕카멘의 부모, 아이와 안케세나문의 결혼 가능성은 점선입니다. 호렘헤브에게는 혈연 선을 긋지 않았습니다.",
    color: "#8c3a45",
    soft: "#f8ecee",
  },
];

const D18_DISPUTES: Dispute[] = [
  {
    id: "thutmose-i-birth",
    title: "투트모세 1세의 출생",
    main: "어머니로 센세네브가 전합니다. 왕족이 아닌 사람입니다. 아버지는 기록으로 닫히지 않습니다.",
    other: "앞 왕 아멘호테프 1세의 아들인지는 확인되지 않습니다. 왕위가 이어진 것과 부자인 것을 같은 선으로 긋지 않았습니다.",
  },
  {
    id: "tut-parents",
    title: "투탕카멘의 부모",
    main: "이름 있는 부왕과 모후를 비석이 확정하지 않습니다. 네페르티티를 어머니로 단정하는 기록도 없습니다.",
    other: "2010년 미라 유전자 연구는 KV55의 남성을 아버지, KV35의 젊은 여인을 어머니로 봅니다. 젊은 여인은 아멘호테프 3세와 티예의 딸로 추정되고 이름은 모릅니다. KV55가 아케나텐인지 스멘크카레인지는 갈립니다. 그래서 두 선 모두 점선입니다.",
  },
  {
    id: "ay-horemheb",
    title: "아이와 호렘헤브",
    main: "둘 다 투탕카멘 뒤에 왕이 되었습니다. 호렘헤브와 앞 왕의 혈연은 확인되지 않아 선을 긋지 않았습니다.",
    other: "아이가 티예의 오라비인지는 연구만 있고 확정이 아닙니다. 안케세나문과 결혼했다는 반지는 가능성으로 점선만 두었습니다.",
  },
];

const D18_NOTES: NameNote[] = [
  {
    title: "하트셉수트와 투트모세 3세",
    body: "하트셉수트는 투트모세 3세의 어머니가 아닙니다. 아버지의 이복 누이이자, 아버지가 죽은 뒤 섭정을 거쳐 왕이 된 사람입니다. 3세의 어머니는 이세트입니다.",
  },
  {
    title: "메리트레-하트셉수트",
    body: "이름에 하트셉수트가 들어 있지만, 여왕 하트셉수트와 다른 사람입니다. 투트모세 3세의 왕비이고 아멘호테프 2세의 어머니입니다.",
  },
  {
    title: "연대",
    body: "칸의 ‘약’ 연대는 쇼(2000)의 표입니다. 공동 통치 때문에 하트셉수트의 왕 시절은 투트모세 3세의 재위 안에 들어갑니다. 학설에 따라 해가 움직입니다.",
  },
];

function d18Links(): TreeLink[] {
  const links: TreeLink[] = [];
  const parent = (from: string, to: string) => links.push({ from, to, kind: "parent" });
  const parents = (child: string, ...from: string[]) => from.forEach((id) => parent(id, child));
  const spouse = (a: string, b: string) => links.push({ from: a, to: b, kind: "spouse" });
  const variantParent = (from: string, to: string) => links.push({ from, to, kind: "variant-parent" });
  const variantSpouse = (a: string, b: string) => links.push({ from: a, to: b, kind: "variant-spouse" });

  spouse("ahmose-i", "ahmose-nefertari");
  parents("amenhotep-i", "ahmose-i", "ahmose-nefertari");
  parents("queen-ahmose", "ahmose-i", "ahmose-nefertari");
  spouse("thutmose-i", "queen-ahmose");
  spouse("thutmose-i", "mutnofret");
  parents("hatshepsut", "thutmose-i", "queen-ahmose");
  parents("thutmose-ii", "thutmose-i", "mutnofret");
  spouse("thutmose-ii", "hatshepsut");
  spouse("thutmose-ii", "iset");
  parents("thutmose-iii", "thutmose-ii", "iset");
  spouse("thutmose-iii", "merytre");
  parents("amenhotep-ii", "thutmose-iii", "merytre");
  spouse("amenhotep-ii", "tiaa");
  parents("thutmose-iv", "amenhotep-ii", "tiaa");
  spouse("thutmose-iv", "mutemwiya");
  parents("amenhotep-iii", "thutmose-iv", "mutemwiya");
  spouse("amenhotep-iii", "tiye");
  parents("akhenaten", "amenhotep-iii", "tiye");
  spouse("akhenaten", "nefertiti");
  parents("ankhesenamun", "akhenaten", "nefertiti");
  variantParent("amenhotep-iii", "younger-lady");
  variantParent("tiye", "younger-lady");
  variantParent("akhenaten", "tutankhamun");
  variantParent("younger-lady", "tutankhamun");
  spouse("tutankhamun", "ankhesenamun");
  variantSpouse("ay", "ankhesenamun");

  assertLink(links, "spouse", "thutmose-ii", "hatshepsut");
  assertLink(links, "parent", "iset", "thutmose-iii");
  assertNoLink(links, "parent", "hatshepsut", "thutmose-iii");
  assertNoLink(links, "parent", "amenhotep-i", "thutmose-i");
  assertNoLink(links, "parent", "akhenaten", "tutankhamun");
  assertNoLink(links, "parent", "nefertiti", "tutankhamun");
  assertLink(links, "variant-parent", "akhenaten", "tutankhamun");
  assertLink(links, "variant-parent", "younger-lady", "tutankhamun");
  assertNoLink(links, "parent", "tutankhamun", "ay");
  assertNoLink(links, "parent", "ay", "horemheb");
  return links;
}

const D18_SEEDS: TreeSeed[] = [
  {
    id: "ahmose-i",
    ko: "아흐모세 1세",
    roman: "Ahmose I",
    band: "ahmose",
    col: 2.4,
    y: y(0),
    years: "약 1550–1525",
    summary: "제18왕조를 연 왕으로 봅니다. 힉소스 세력이 남은 북쪽을 끝내고 테베의 왕가가 두 땅을 다시 이었다고 평가됩니다.",
    aliases: ["ahmose", "ahmose i", "아흐모세", "아흐모세 1세", "아흐모스"],
  },
  {
    id: "ahmose-nefertari",
    ko: "아흐모세 네페르타리",
    roman: "Ahmose-Nefertari",
    band: "ahmose",
    col: 3.6,
    y: y(0),
    guestTag: "왕비",
    years: "왕비",
    summary: "아흐모세 1세의 누이이자 아내로 전합니다. 아멘호테프 1세의 어머니이고, 나중에는 신처럼 모셔지기도 합니다.",
    aliases: ["ahmose-nefertari", "ahmosenefertari", "아흐모세 네페르타리"],
  },
  {
    id: "amenhotep-i",
    ko: "아멘호테프 1세",
    roman: "Amenhotep I",
    band: "ahmose",
    col: 3.0,
    y: y(1),
    years: "약 1525–1504",
    summary: "아흐모세 1세와 아흐모세 네페르타리의 아들입니다. 왕위를 이은 아들이 확인되지 않습니다.",
    note: "다음 왕 투트모세 1세와의 부자 관계는 그리지 않았습니다.",
    aliases: ["amenhotep i", "amenhotep 1", "아멘호테프 1세", "아멘호테프"],
  },
  {
    id: "queen-ahmose",
    ko: "왕비 아흐모세",
    roman: "Queen Ahmose",
    band: "ahmose",
    col: 5.2,
    y: y(1),
    guestTag: "왕비",
    years: "왕비",
    summary: "투트모세 1세의 대왕비이고 하트셉수트의 어머니입니다. 아흐모세 1세와 아흐모세 네페르타리의 딸로 보통 봅니다.",
    aliases: ["queen ahmose", "왕비 아흐모세"],
  },
  {
    id: "thutmose-i",
    ko: "투트모세 1세",
    roman: "Thutmose I",
    band: "ahmose",
    col: 6.4,
    y: y(1),
    years: "약 1504–1492",
    summary: "아멘호테프 1세 다음의 왕입니다. 어머니 센세네브는 왕족이 아닌 것으로 전하고, 아버지는 확정되지 않습니다.",
    note: "유프라테스까지 갔다는 이집트 쪽 주장이 그의 시대에 나옵니다. 가계와는 별개의 원정 기록입니다.",
    aliases: ["thutmose i", "tuthmosis i", "투트모세 1세", "투트모스 1세"],
  },
  {
    id: "mutnofret",
    ko: "무트노프레트",
    roman: "Mutnofret",
    band: "ahmose",
    col: 7.6,
    y: y(1),
    guestTag: "왕비",
    years: "왕비",
    summary: "투트모세 1세의 아내이고 투트모세 2세의 어머니입니다. 아흐모세 1세의 딸일 수 있으나, 그 선은 확정하지 않아 긋지 않았습니다.",
    aliases: ["mutnofret", "mutneferet", "무트노프레트"],
  },
  {
    id: "hatshepsut",
    ko: "하트셉수트",
    roman: "Hatshepsut",
    band: "thutmose",
    col: 5.2,
    y: y(2),
    href: "/rulers/hatshepsut",
    years: "약 1473–1458",
    summary: "투트모세 1세와 왕비 아흐모세의 딸입니다. 이복 오라비 투트모세 2세의 아내였고, 나중에는 스스로 왕의 칭호를 썼습니다.",
    aliases: ["hatshepsut", "hatchepsut", "하트셉수트", "핫셉수트"],
  },
  {
    id: "thutmose-ii",
    ko: "투트모세 2세",
    roman: "Thutmose II",
    band: "thutmose",
    col: 6.4,
    y: y(2),
    years: "약 1492–1479",
    summary: "투트모세 1세와 무트노프레트의 아들입니다. 이복 누이 하트셉수트와 결혼했고, 이세트와의 사이에서 투트모세 3세가 태어납니다.",
    aliases: ["thutmose ii", "tuthmosis ii", "투트모세 2세"],
  },
  {
    id: "iset",
    ko: "이세트",
    roman: "Iset",
    band: "thutmose",
    col: 7.6,
    y: y(2),
    guestTag: "왕비",
    years: "왕비",
    summary: "투트모세 2세의 아내이고 투트모세 3세의 어머니입니다. 여신 이시스와 다른 사람입니다.",
    aliases: ["iset", "isis mother", "이세트"],
  },
  {
    id: "thutmose-iii",
    ko: "투트모세 3세",
    roman: "Thutmose III",
    band: "thutmose",
    col: 6.4,
    y: y(3),
    href: "/rulers/thutmose-iii",
    years: "약 1479–1425",
    summary: "투트모세 2세와 이세트의 아들입니다. 어린 왕의 세월에 하트셉수트와 겹치고, 그 뒤 레반트 원정으로 유명합니다.",
    aliases: ["thutmose iii", "tuthmosis iii", "투트모세 3세"],
  },
  {
    id: "merytre",
    ko: "메리트레",
    roman: "Merytre-Hatshepsut",
    band: "thutmose",
    col: 7.6,
    y: y(3),
    guestTag: "왕비",
    years: "왕비",
    summary: "투트모세 3세의 왕비이고 아멘호테프 2세의 어머니입니다. 여왕 하트셉수트와는 다른 사람입니다.",
    aliases: ["merytre", "merytre-hatshepsut", "메리트레", "메리트레하트셉수트"],
  },
  {
    id: "amenhotep-ii",
    ko: "아멘호테프 2세",
    roman: "Amenhotep II",
    band: "amenhotep",
    col: 6.4,
    y: y(4),
    years: "약 1427–1400",
    summary: "투트모세 3세와 메리트레의 아들입니다. 재위 초의 몇 해는 아버지와 겹쳐 잡힙니다.",
    aliases: ["amenhotep ii", "아멘호테프 2세"],
  },
  {
    id: "tiaa",
    ko: "티아",
    roman: "Tiaa",
    band: "amenhotep",
    col: 7.6,
    y: y(4),
    guestTag: "왕비",
    years: "왕비",
    summary: "아멘호테프 2세의 왕비이고 투트모세 4세의 어머니로 봅니다.",
    aliases: ["tiaa", "티아"],
  },
  {
    id: "thutmose-iv",
    ko: "투트모세 4세",
    roman: "Thutmose IV",
    band: "amenhotep",
    col: 6.4,
    y: y(5),
    years: "약 1400–1390",
    summary: "아멘호테프 2세와 티아의 아들입니다. 기자 스핑크스 앞의 꿈 비석이 그의 이름으로 남아 있습니다.",
    aliases: ["thutmose iv", "투트모세 4세"],
  },
  {
    id: "mutemwiya",
    ko: "무템위아",
    roman: "Mutemwiya",
    band: "amenhotep",
    col: 7.6,
    y: y(5),
    guestTag: "왕비",
    years: "왕비",
    summary: "투트모세 4세의 왕비이고 아멘호테프 3세의 어머니로 봅니다.",
    aliases: ["mutemwiya", "mutemwia", "무템위아"],
  },
  {
    id: "amenhotep-iii",
    ko: "아멘호테프 3세",
    roman: "Amenhotep III",
    band: "amenhotep",
    col: 5.2,
    y: y(6),
    years: "약 1390–1352",
    summary: "투트모세 4세와 무템위아의 아들입니다. 티예와 결혼했고, 아들 아멘호테프 4세가 아케나텐이 됩니다.",
    aliases: ["amenhotep iii", "아멘호테프 3세"],
  },
  {
    id: "tiye",
    ko: "티예",
    roman: "Tiye",
    band: "amenhotep",
    col: 6.4,
    y: y(6),
    guestTag: "왕비",
    years: "왕비",
    summary: "아멘호테프 3세의 대왕비이고 아케나텐의 어머니입니다. 부모 유야와 투야는 왕족이 아닙니다.",
    aliases: ["tiye", "tiy", "티예", "티이"],
  },
  {
    id: "akhenaten",
    ko: "아케나텐",
    roman: "Akhenaten",
    band: "amarna",
    col: 5.2,
    y: y(7),
    href: "/rulers/akhenaten",
    years: "약 1352–1336",
    summary: "아멘호테프 3세와 티예의 아들입니다. 즉위 이름은 아멘호테프 4세였고, 아텐을 앞세우며 이름을 바꿨습니다. 네페르티티의 남편입니다.",
    note: "투탕카멘의 아버지로 자주 거론되지만, 그 동일시는 KV55 미라 문제와 함께 점선으로 두었습니다.",
    aliases: ["akhenaten", "akhunaten", "amenhotep iv", "아케나텐", "아케나톤", "아멘호테프 4세"],
  },
  {
    id: "nefertiti",
    ko: "네페르티티",
    roman: "Nefertiti",
    band: "amarna",
    col: 6.4,
    y: y(7),
    guestTag: "왕비",
    years: "왕비",
    summary: "아케나텐의 왕비입니다. 딸 여섯 중 셋째가 안케센파아텐, 곧 안케세나문입니다. 투탕카멘의 어머니로 확정하지 않습니다.",
    aliases: ["nefertiti", "네페르티티", "네페르티티왕비"],
  },
  {
    id: "younger-lady",
    ko: "젊은 여인",
    roman: "Younger Lady",
    band: "amarna",
    col: 8.0,
    y: y(7),
    guestTag: "KV35",
    years: "이름 불명",
    badge: "불확실",
    summary: "KV35에서 나온 여성 미라입니다. 이름이 확인되지 않아 연구자들이 ‘젊은 여인’이라고 부릅니다. 투탕카멘의 어머니 후보입니다.",
    note: "유전자 연구에서는 아멘호테프 3세와 티예의 딸로 봅니다. 네페르티티라는 이름은 붙이지 않았습니다.",
    aliases: ["younger lady", "kv35", "젊은 여인", "KV35 젊은 여인"],
  },
  {
    id: "ankhesenamun",
    ko: "안케세나문",
    roman: "Ankhesenamun",
    band: "amarna",
    col: 5.8,
    y: y(8),
    guestTag: "왕비",
    years: "왕비",
    summary: "아케나텐과 네페르티티의 딸입니다. 처음 이름은 안케센파아텐이고, 투탕카멘의 왕비가 되면서 이름이 바뀝니다.",
    note: "투탕카멘 무덤의 두 사산아는 이 부부의 자녀로 보통 설명합니다. 칸으로는 넣지 않았습니다.",
    aliases: ["ankhesenamun", "ankhesenpaaten", "ankhesenamon", "안케세나문", "안케센파아텐"],
  },
  {
    id: "tutankhamun",
    ko: "투탕카멘",
    roman: "Tutankhamun",
    band: "amarna",
    col: 7.2,
    y: y(8),
    href: "/rulers/tutankhamun",
    years: "약 1336–1327",
    badge: "불확실",
    summary: "안케세나문의 남편이고, 짧은 치세 끝에 죽었습니다. 처음 이름은 투탕카텐에 가깝습니다. 부모의 이름은 확정하지 않습니다.",
    note: "아버지 후보는 KV55 남성으로, 아케나텐일 가능성이 크지만 다툼이 있습니다. 어머니는 이름 없는 KV35의 젊은 여인으로 연구됩니다.",
    aliases: ["tutankhamun", "tutankhamen", "tutankhaten", "king tut", "투탕카멘", "투탕카문", "투탄카멘"],
  },
  {
    id: "ay",
    ko: "아이",
    roman: "Ay",
    band: "amarna",
    col: 9.6,
    y: y(8),
    years: "약 1327–1323",
    summary: "투탕카멘 다음의 왕입니다. 앞 왕의 아들로 확인되지 않습니다. 티예의 오라비일 가능성은 확정이 아니어서 부모 선을 긋지 않았습니다.",
    note: "안케세나문과 결혼했을 가능성은 이름이 함께 있는 반지 때문에 이야기됩니다. 점선입니다.",
    aliases: ["ay", "aye", "아이"],
  },
  {
    id: "horemheb",
    ko: "호렘헤브",
    roman: "Horemheb",
    band: "amarna",
    col: 10.8,
    y: y(8),
    years: "약 1323–1295",
    summary: "투탕카멘과 아이 시대의 장군 출신으로 왕위를 이었습니다. 앞선 왕과의 혈연은 확인되지 않아 선을 긋지 않았습니다. 제18왕조의 마지막으로 봅니다.",
    aliases: ["horemheb", "horemhab", "호렘헤브", "호렘헵"],
  },
];

const D19_BANDS: BandMeta[] = [
  {
    id: "founders",
    ko: "19왕조의 시작",
    en: "Founders",
    hint: "람세스 1세는 호렘헤브의 재상 출신입니다. 아들은 아닙니다. 세티 1세가 그 아들입니다.",
    color: "#0f5e5c",
    soft: "#e5f3f2",
  },
  {
    id: "ramesses",
    ko: "람세스 2세",
    en: "Ramesses II",
    hint: "네페르타리와 이세트노프레트, 두 왕비를 같이 그렸습니다. 왕위를 이은 아들의 어머니는 이세트노프레트입니다.",
    color: "#8a6420",
    soft: "#f8f1e2",
  },
  {
    id: "children",
    ko: "자녀",
    en: "Children",
    hint: "아문헤르케페셰프는 네페르타리의 아들이고 왕위 전에 죽었습니다. 메르넵타는 이세트노프레트의 아들입니다.",
    color: "#3e4d7a",
    soft: "#e7edf7",
  },
];

const D19_DISPUTES: Dispute[] = [
  {
    id: "merneptah-mother",
    title: "메르넵타의 어머니",
    main: "메르넵타는 람세스 2세와 이세트노프레트의 아들입니다. 네페르타리의 아들이 아닙니다.",
    other: "네페르타리 소생으로 자주 보이는 맏아들 아문헤르케페셰프는 아버지보다 먼저 죽었습니다. 왕위와 왕비의 명성을 한 선으로 잇지 않습니다.",
  },
];

const D19_NOTES: NameNote[] = [
  {
    title: "자녀가 아주 많습니다",
    body: "신전의 이름 목록은 람세스 2세의 자녀가 많았음을 보여 줍니다. 이 그림은 네페르타리의 아들 아문헤르케페셰프, 이세트노프레트의 아들 카엠와세트와 메르넵타만 남겼습니다.",
  },
  {
    title: "람세스 1세",
    body: "호렘헤브가 죽은 뒤 왕이 되었습니다. 혈통으로 제18왕조에 붙이지 않습니다.",
  },
];

function d19Links(): TreeLink[] {
  const links: TreeLink[] = [];
  const parent = (from: string, to: string) => links.push({ from, to, kind: "parent" });
  const parents = (child: string, ...from: string[]) => from.forEach((id) => parent(id, child));
  const spouse = (a: string, b: string) => links.push({ from: a, to: b, kind: "spouse" });

  spouse("ramesses-i", "sitre");
  parents("seti-i", "ramesses-i", "sitre");
  spouse("seti-i", "tuya");
  parents("ramesses-ii", "seti-i", "tuya");
  spouse("ramesses-ii", "nefertari");
  spouse("ramesses-ii", "isetnofret");
  parents("amun-her-khepeshef", "ramesses-ii", "nefertari");
  parents("khaemwaset", "ramesses-ii", "isetnofret");
  parents("merneptah", "ramesses-ii", "isetnofret");

  assertLink(links, "parent", "isetnofret", "merneptah");
  assertNoLink(links, "parent", "nefertari", "merneptah");
  assertLink(links, "parent", "nefertari", "amun-her-khepeshef");
  assertNoLink(links, "parent", "horemheb", "ramesses-i");
  return links;
}

const D19_SEEDS: TreeSeed[] = [
  {
    id: "ramesses-i",
    ko: "람세스 1세",
    roman: "Ramesses I",
    band: "founders",
    col: 2.4,
    y: y(0),
    years: "약 1295–1294",
    summary: "제19왕조의 첫 왕입니다. 즉위 전에는 파라메세스라는 이름의 재상·군인이었고, 호렘헤브의 아들은 아닙니다.",
    aliases: ["ramesses i", "ramses i", "paramessu", "람세스 1세", "람세스"],
  },
  {
    id: "sitre",
    ko: "시트레",
    roman: "Sitre",
    band: "founders",
    col: 3.6,
    y: y(0),
    guestTag: "왕비",
    years: "왕비",
    summary: "람세스 1세의 아내이고 세티 1세의 어머니로 봅니다.",
    aliases: ["sitre", "시트레"],
  },
  {
    id: "seti-i",
    ko: "세티 1세",
    roman: "Seti I",
    band: "founders",
    col: 2.4,
    y: y(1),
    years: "약 1294–1279",
    summary: "람세스 1세와 시트레의 아들입니다. 신전과 전역을 남겼고, 아들 람세스 2세가 뒤를 잇습니다.",
    aliases: ["seti i", "seti", "세티", "세티 1세"],
  },
  {
    id: "tuya",
    ko: "투야",
    roman: "Tuya",
    band: "founders",
    col: 3.6,
    y: y(1),
    guestTag: "왕비",
    years: "왕비",
    summary: "세티 1세의 왕비이고 람세스 2세의 어머니입니다. 아멘호테프 3세 시대의 투야와는 다른 사람입니다.",
    aliases: ["tuya", "tuy", "mut-tuya", "투야"],
  },
  {
    id: "ramesses-ii",
    ko: "람세스 2세",
    roman: "Ramesses II",
    band: "ramesses",
    col: 2.4,
    y: y(2),
    href: "/rulers/ramesses-ii",
    years: "약 1279–1213",
    summary: "세티 1세와 투야의 아들입니다. 재위가 매우 길어 많은 자녀가 먼저 죽었고, 왕위는 메르넵타에게 갑니다.",
    aliases: ["ramesses ii", "ramses ii", "ramses", "람세스 2세", "람세스2세"],
  },
  {
    id: "nefertari",
    ko: "네페르타리",
    roman: "Nefertari",
    band: "ramesses",
    col: 3.6,
    y: y(2),
    guestTag: "왕비",
    years: "왕비",
    summary: "람세스 2세의 대왕비입니다. 아부심벨의 작은 신전과 왕비의 계곡 무덤으로 유명합니다. 메르넵타의 어머니는 아닙니다.",
    aliases: ["nefertari", "네페르타리"],
  },
  {
    id: "isetnofret",
    ko: "이세트노프레트",
    roman: "Isetnofret",
    band: "ramesses",
    col: 5.2,
    y: y(2),
    guestTag: "왕비",
    years: "왕비",
    summary: "람세스 2세의 또 다른 대왕비입니다. 메르넵타와 카엠와세트의 어머니입니다.",
    aliases: ["isetnofret", "isnofret", "이세트노프레트"],
  },
  {
    id: "amun-her-khepeshef",
    ko: "아문헤르케페셰프",
    roman: "Amun-her-khepeshef",
    band: "children",
    col: 3.0,
    y: y(3),
    guestTag: "왕자",
    years: "왕자",
    summary: "람세스 2세와 네페르타리의 맏아들로 자주 소개됩니다. 왕세자였으나 아버지보다 먼저 죽었습니다.",
    aliases: ["amun-her-khepeshef", "amunherkhepeshef", "아문헤르케페셰프"],
  },
  {
    id: "khaemwaset",
    ko: "카엠와세트",
    roman: "Khaemwaset",
    band: "children",
    col: 4.4,
    y: y(3),
    guestTag: "왕자",
    years: "왕자",
    summary: "람세스 2세와 이세트노프레트의 아들입니다. 프타의 대사제로, 옛 피라미드를 돌본 왕자로 이름이 큽니다. 왕이 되지는 못했습니다.",
    aliases: ["khaemwaset", "khaemwise", "카엠와세트"],
  },
  {
    id: "merneptah",
    ko: "메르넵타",
    roman: "Merneptah",
    band: "children",
    col: 5.6,
    y: y(3),
    years: "약 1213–1203",
    summary: "람세스 2세와 이세트노프레트의 아들입니다. 아버지가 오래 사는 동안 형이 먼저 죽어, 늦은 나이에 왕위를 잇습니다.",
    aliases: ["merneptah", "merenptah", "메르넵타", "메렌프타"],
  },
];

const PTOLEMY_BANDS: BandMeta[] = [
  {
    id: "early",
    ko: "1세에서 4세",
    en: "Early Ptolemies",
    hint: "왕을 칭한 1세부터, 3세의 어머니 아르시노에 1세까지입니다. 아르시노에 2세는 3세의 어머니가 아닙니다.",
    color: "#3e4d7a",
    soft: "#e7edf7",
  },
  {
    id: "middle",
    ko: "5세에서 9세",
    en: "Middle",
    hint: "7세로 가는 피는 6세가 아니라 그 동생 8세와, 6세의 딸 클레오파트라 3세를 통과합니다.",
    color: "#0f5e5c",
    soft: "#e5f3f2",
  },
  {
    id: "cleopatra",
    ko: "12세의 자녀",
    en: "Ptolemy XII",
    hint: "클레오파트라 7세와 형제입니다. 어머니의 이름은 확실하지 않아 클레오파트라 5세에서 점선입니다.",
    color: "#8a6420",
    soft: "#f8f1e2",
  },
  {
    id: "children",
    ko: "7세의 자녀",
    en: "Her children",
    hint: "카이사리온은 카이사르와의 아들로 전합니다. 세 아이는 안토니우스와의 자녀입니다. 두 로마 사람은 로마이야기로 이어집니다.",
    color: "#8c3a45",
    soft: "#f8ecee",
  },
];

const PTOLEMY_DISPUTES: Dispute[] = [
  {
    id: "ptolemy-xii-mother",
    title: "12세와 7세의 어머니",
    main: "프톨레마이오스 12세의 아버지는 9세로 보통 봅니다. 어머니는 기록에 확실하지 않아 칸을 만들지 않았습니다.",
    other: "12세의 아내 클레오파트라 5세가 7세와 형제들의 어머니인지는 닫히지 않습니다. 5세는 기원전 69년 무렵 기록에서 사라지는데, 7세의 출생도 그 해로 잡힙니다. 어머니 선은 전부 점선입니다.",
  },
  {
    id: "caesarion",
    title: "카이사리온의 아버지",
    main: "고대부터 카이사르의 아들로 전합니다. 클레오파트라 쪽이 그렇게 내세웠습니다.",
    other: "카이사르의 유언이 양자로 삼은 사람은 옥타비아누스입니다. 아버지 선을 지우지는 않되, 유언과 소문이 달랐다는 점을 적어둡니다.",
  },
];

const PTOLEMY_NOTES: NameNote[] = [
  {
    title: "아르시노에 1세와 2세",
    body: "프톨레마이오스 3세의 어머니는 아르시노에 1세입니다. 2세의 누이이자 나중 아내인 아르시노에 2세가 아닙니다. 2세는 이 그림에서 뺐습니다.",
  },
  {
    title: "남매 혼인과 뺀 왕",
    body: "이 왕가는 남매 결혼을 반복합니다. 8세는 누이 클레오파트라 2세와도 결혼했지만, 7세로 가는 선은 클레오파트라 3세 쪽입니다. 10세·11세와 짧은 공동 통치자는 넣지 않았습니다.",
  },
  {
    title: "연대",
    body: "칸의 해는 기원전 재위입니다. 추방과 공동 통치 때문에 9세와 12세는 두 구간으로 적었습니다. 1세가 왕을 칭한 해는 305년 무렵이고, 그 전은 알렉산드로스 사후의 총독 시절입니다.",
  },
];

function ptolemyLinks(): TreeLink[] {
  const links: TreeLink[] = [];
  const parent = (from: string, to: string) => links.push({ from, to, kind: "parent" });
  const parents = (child: string, ...from: string[]) => from.forEach((id) => parent(id, child));
  const spouse = (a: string, b: string) => links.push({ from: a, to: b, kind: "spouse" });
  const variantParent = (from: string, to: string) => links.push({ from, to, kind: "variant-parent" });

  spouse("ptolemy-i", "berenice-i");
  parents("ptolemy-ii", "ptolemy-i", "berenice-i");
  spouse("ptolemy-ii", "arsinoe-i");
  parents("ptolemy-iii", "ptolemy-ii", "arsinoe-i");
  spouse("ptolemy-iii", "berenice-ii");
  parents("ptolemy-iv", "ptolemy-iii", "berenice-ii");
  parents("arsinoe-iii", "ptolemy-iii", "berenice-ii");
  spouse("ptolemy-iv", "arsinoe-iii");
  parents("ptolemy-v", "ptolemy-iv", "arsinoe-iii");
  spouse("ptolemy-v", "cleopatra-i");
  for (const id of ["ptolemy-vi", "cleopatra-ii", "ptolemy-viii"]) parents(id, "ptolemy-v", "cleopatra-i");
  spouse("ptolemy-vi", "cleopatra-ii");
  parents("cleopatra-iii", "ptolemy-vi", "cleopatra-ii");
  spouse("ptolemy-viii", "cleopatra-iii");
  parents("ptolemy-ix", "ptolemy-viii", "cleopatra-iii");
  parent("ptolemy-ix", "ptolemy-xii");
  spouse("ptolemy-xii", "cleopatra-v");
  for (const id of ["berenice-iv", "cleopatra-vii", "arsinoe-iv", "ptolemy-xiii", "ptolemy-xiv"]) {
    parent("ptolemy-xii", id);
    variantParent("cleopatra-v", id);
  }
  spouse("cleopatra-vii", "julius-caesar");
  spouse("cleopatra-vii", "mark-antony");
  parents("caesarion", "cleopatra-vii", "julius-caesar");
  for (const id of ["alexander-helios", "cleopatra-selene", "ptolemy-philadelphus"]) parents(id, "cleopatra-vii", "mark-antony");

  assertLink(links, "parent", "arsinoe-i", "ptolemy-iii");
  assertNoLink(links, "parent", "cleopatra-v", "cleopatra-vii");
  assertLink(links, "variant-parent", "cleopatra-v", "cleopatra-vii");
  assertLink(links, "parent", "ptolemy-xii", "cleopatra-vii");
  assertLink(links, "parent", "julius-caesar", "caesarion");
  assertLink(links, "parent", "mark-antony", "cleopatra-selene");
  assertNoLink(links, "parent", "julius-caesar", "alexander-helios");
  return links;
}

const PTOLEMY_SEEDS: TreeSeed[] = [
  {
    id: "ptolemy-i",
    ko: "프톨레마이오스 1세",
    roman: "Ptolemy I",
    band: "early",
    col: 2.4,
    y: y(0),
    years: "305–282",
    summary: "알렉산드로스의 부하에서 이집트의 왕이 된 사람입니다. 왕을 칭한 때는 기원전 305년 무렵이고, 그 전 323년부터는 총독이었습니다.",
    aliases: ["ptolemy i", "ptolemy 1", "soter", "프톨레마이오스 1세", "프톨레마이오스"],
  },
  {
    id: "berenice-i",
    ko: "베레니케 1세",
    roman: "Berenice I",
    band: "early",
    col: 3.6,
    y: y(0),
    guestTag: "왕비",
    years: "왕비",
    summary: "프톨레마이오스 1세의 아내이고 2세의 어머니입니다. 1세에게는 다른 아내 에우리디케도 있었으나, 왕위를 이은 아들의 어머니는 베레니케입니다.",
    aliases: ["berenice i", "berenice", "베레니케", "베레니케 1세"],
  },
  {
    id: "ptolemy-ii",
    ko: "프톨레마이오스 2세",
    roman: "Ptolemy II",
    band: "early",
    col: 2.4,
    y: y(1),
    years: "282–246",
    summary: "1세와 베레니케 1세의 아들입니다. 기원전 285년부터 아버지와 함께했다는 계산도 있습니다. 누이 아르시노에 2세와 결혼했지만, 다음 왕의 어머니는 그 누이가 아닙니다.",
    aliases: ["ptolemy ii", "philadelphus", "프톨레마이오스 2세"],
  },
  {
    id: "arsinoe-i",
    ko: "아르시노에 1세",
    roman: "Arsinoe I",
    band: "early",
    col: 3.6,
    y: y(1),
    guestTag: "왕비",
    years: "왕비",
    summary: "프톨레마이오스 3세의 어머니입니다. 트라키아 왕 리시마코스의 딸로 이 왕가의 출생 딸이 아니고, 나중에 폐위됩니다.",
    aliases: ["arsinoe i", "아르시노에 1세", "아르시노에"],
  },
  {
    id: "ptolemy-iii",
    ko: "프톨레마이오스 3세",
    roman: "Ptolemy III",
    band: "early",
    col: 2.4,
    y: y(2),
    years: "246–222",
    summary: "2세와 아르시노에 1세의 아들입니다. 키레네의 베레니케 2세와 결혼합니다.",
    aliases: ["ptolemy iii", "euergetes", "프톨레마이오스 3세"],
  },
  {
    id: "berenice-ii",
    ko: "베레니케 2세",
    roman: "Berenice II",
    band: "early",
    col: 3.6,
    y: y(2),
    guestTag: "왕비",
    years: "왕비",
    summary: "키레네 왕 마가스의 딸이고, 3세의 아내입니다. 4세와 아르시노에 3세의 어머니입니다.",
    aliases: ["berenice ii", "베레니케 2세"],
  },
  {
    id: "ptolemy-iv",
    ko: "프톨레마이오스 4세",
    roman: "Ptolemy IV",
    band: "early",
    col: 2.4,
    y: y(3),
    years: "222–204",
    summary: "3세와 베레니케 2세의 아들입니다. 누이 아르시노에 3세와 결혼합니다.",
    aliases: ["ptolemy iv", "philopator", "프톨레마이오스 4세"],
  },
  {
    id: "arsinoe-iii",
    ko: "아르시노에 3세",
    roman: "Arsinoe III",
    band: "early",
    col: 3.6,
    y: y(3),
    guestTag: "왕비",
    years: "왕비",
    summary: "3세와 베레니케 2세의 딸이고, 오라비 4세의 아내이며, 5세의 어머니입니다.",
    aliases: ["arsinoe iii", "아르시노에 3세"],
  },
  {
    id: "ptolemy-v",
    ko: "프톨레마이오스 5세",
    roman: "Ptolemy V",
    band: "middle",
    col: 2.4,
    y: y(4),
    years: "204–180",
    summary: "4세와 아르시노에 3세의 아들입니다. 로제타 석의 포고(기원전 196년)가 그의 치세입니다. 셀레우코스 왕가의 클레오파트라 1세와 결혼합니다.",
    aliases: ["ptolemy v", "epiphanes", "프톨레마이오스 5세"],
  },
  {
    id: "cleopatra-i",
    ko: "클레오파트라 1세",
    roman: "Cleopatra I",
    band: "middle",
    col: 3.6,
    y: y(4),
    guestTag: "왕비",
    years: "왕비",
    summary: "셀레우코스 왕 안티오코스 3세의 딸입니다. 5세의 아내이고, 6세·클레오파트라 2세·8세의 어머니입니다. 이집트 왕가에서 클레오파트라라는 이름이 여기서 크게 이어집니다.",
    aliases: ["cleopatra i", "클레오파트라 1세"],
  },
  {
    id: "ptolemy-vi",
    ko: "프톨레마이오스 6세",
    roman: "Ptolemy VI",
    band: "middle",
    col: 1.2,
    y: y(5),
    years: "180–145",
    summary: "5세와 클레오파트라 1세의 아들입니다. 누이 클레오파트라 2세와 결혼했고, 그 딸이 클레오파트라 3세입니다. 왕위는 동생 8세 쪽으로도 넘어갑니다.",
    aliases: ["ptolemy vi", "philometor", "프톨레마이오스 6세"],
  },
  {
    id: "cleopatra-ii",
    ko: "클레오파트라 2세",
    roman: "Cleopatra II",
    band: "middle",
    col: 2.4,
    y: y(5),
    years: "공동 통치",
    summary: "5세와 클레오파트라 1세의 딸입니다. 오라비 6세의 아내이고 클레오파트라 3세의 어머니입니다. 동생 8세와도 결혼했다는 것이 뒤의 정치입니다. 7세로 가는 선은 3세 쪽만 그렸습니다.",
    aliases: ["cleopatra ii", "클레오파트라 2세"],
  },
  {
    id: "ptolemy-viii",
    ko: "프톨레마이오스 8세",
    roman: "Ptolemy VIII",
    band: "middle",
    col: 4.8,
    y: y(5),
    years: "145–116",
    summary: "5세와 클레오파트라 1세의 아들로, 6세의 동생입니다. 기원전 170년부터 형과 겹친 공동 통치가 있고, 형의 사후 145년부터 다시 이집트를 잡습니다. 조카 클레오파트라 3세와 결혼해 9세를 둡니다.",
    aliases: ["ptolemy viii", "physcon", "프톨레마이오스 8세"],
  },
  {
    id: "cleopatra-iii",
    ko: "클레오파트라 3세",
    roman: "Cleopatra III",
    band: "middle",
    col: 2.4,
    y: y(6),
    years: "공동 통치",
    summary: "6세와 클레오파트라 2세의 딸입니다. 외삼촌 8세와 결혼했고, 9세의 어머니입니다.",
    aliases: ["cleopatra iii", "클레오파트라 3세"],
  },
  {
    id: "ptolemy-ix",
    ko: "프톨레마이오스 9세",
    roman: "Ptolemy IX",
    band: "middle",
    col: 3.6,
    y: y(7),
    years: "116–107·88–81",
    summary: "8세와 클레오파트라 3세의 아들입니다. 사이에는 동생 10세의 치세가 끼어, 재위가 두 구간입니다. 12세의 아버지로 보통 봅니다.",
    aliases: ["ptolemy ix", "lathyros", "프톨레마이오스 9세"],
  },
  {
    id: "ptolemy-xii",
    ko: "프톨레마이오스 12세",
    roman: "Ptolemy XII",
    band: "cleopatra",
    col: 2.4,
    y: y(8),
    years: "80–58·55–51",
    summary: "9세의 아들로 보통 봅니다. 어머니는 확실하지 않습니다. 로마에 의지해 왕위를 되찾았고, 딸 베레니케 4세를 죽입니다. 아우레테스(피리 부는 사람)라는 별명이 있습니다.",
    aliases: ["ptolemy xii", "auletes", "프톨레마이오스 12세"],
  },
  {
    id: "cleopatra-v",
    ko: "클레오파트라 5세",
    roman: "Cleopatra V",
    band: "cleopatra",
    col: 3.6,
    y: y(8),
    guestTag: "왕비",
    years: "왕비",
    badge: "불확실",
    summary: "12세의 아내로 기록에 남습니다. 기원전 69년 무렵 이후로는 분명하지 않습니다. 7세와 형제들의 어머니일 수는 있어도 확정이 아니라 점선입니다.",
    aliases: ["cleopatra v", "tryphaena", "클레오파트라 5세"],
  },
  {
    id: "berenice-iv",
    ko: "베레니케 4세",
    roman: "Berenice IV",
    band: "cleopatra",
    col: 0,
    y: y(9),
    years: "58–55",
    summary: "12세의 딸입니다. 아버지가 로마에 가 있는 동안 이집트를 다스렸고, 아버지가 돌아온 뒤 죽습니다.",
    aliases: ["berenice iv", "베레니케 4세"],
  },
  {
    id: "cleopatra-vii",
    ko: "클레오파트라 7세",
    roman: "Cleopatra VII",
    band: "cleopatra",
    col: 1.2,
    y: y(9),
    href: "/rulers/cleopatra-vii",
    years: "51–30",
    summary: "12세의 딸이고, 이집트를 다스린 마지막 프톨레마이오스 통치자입니다. 가문은 마케도니아 그리스계입니다. 어머니는 기록마다 불확실합니다.",
    note: "동생 13세·14세와 왕위를 나눴거나 다퉜습니다. 카이사르, 그 뒤 안토니우스와 정치적으로 묶입니다.",
    aliases: ["cleopatra vii", "cleopatra", "클레오파트라", "클레오파트라 7세"],
  },
  {
    id: "arsinoe-iv",
    ko: "아르시노에 4세",
    roman: "Arsinoe IV",
    band: "cleopatra",
    col: 2.4,
    y: y(9),
    years: "동생",
    summary: "12세의 딸이고 7세의 동생입니다. 알렉산드리아 전쟁에서 언니와 맞서 왕을 칭했고, 나중에 죽습니다.",
    aliases: ["arsinoe iv", "아르시노에 4세"],
  },
  {
    id: "ptolemy-xiii",
    ko: "프톨레마이오스 13세",
    roman: "Ptolemy XIII",
    band: "cleopatra",
    col: 3.6,
    y: y(9),
    years: "51–47",
    summary: "12세의 아들이고 7세의 동생이자 공동 통치자입니다. 폼페이우스를 죽인 궁정의 왕으로 전하고, 카이사르와의 전쟁에서 집니다.",
    aliases: ["ptolemy xiii", "프톨레마이오스 13세"],
  },
  {
    id: "ptolemy-xiv",
    ko: "프톨레마이오스 14세",
    roman: "Ptolemy XIV",
    band: "cleopatra",
    col: 4.8,
    y: y(9),
    years: "47–44",
    summary: "12세의 아들이고 7세의 남동생입니다. 13세가 죽은 뒤 언니와 함께 왕이었다가, 기원전 44년에 죽습니다.",
    aliases: ["ptolemy xiv", "프톨레마이오스 14세"],
  },
  {
    id: "julius-caesar",
    ko: "카이사르",
    roman: "Julius Caesar",
    band: "children",
    col: 0.6,
    y: y(10),
    href: `${ROME_URL}/cleopatra`,
    guestTag: "로마",
    years: "생몰 100–44",
    summary: "로마의 장군입니다. 기원전 48–47년 알렉산드리아의 왕위 다툼에 끼어, 클레오파트라 7세를 왕위에 다시 앉힙니다. 카이사리온의 아버지로 고대부터 전합니다.",
    aliases: ["julius caesar", "caesar", "카이사르", "율리우스 카이사르", "시저"],
  },
  {
    id: "mark-antony",
    ko: "안토니우스",
    roman: "Mark Antony",
    band: "children",
    col: 3.0,
    y: y(10),
    href: `${ROME_URL}/wars/actium`,
    guestTag: "로마",
    years: "생몰 83–30",
    summary: "카이사르 사후 로마의 동방을 맡은 장군입니다. 클레오파트라 7세와 세 자녀를 두었고, 기원전 31년 악티움에서 진 뒤 이듬해 죽습니다.",
    aliases: ["mark antony", "marcus antonius", "antony", "안토니우스", "안토니", "마르쿠스 안토니우스"],
  },
  {
    id: "caesarion",
    ko: "카이사리온",
    roman: "Caesarion",
    band: "children",
    col: 0.6,
    y: y(11),
    years: "47–30",
    summary: "클레오파트라 7세와 카이사르의 아들로 전합니다. 프톨레마이오스 15세로도 불립니다. 기원전 30년에 제거되었다는 것이 로마 쪽 전승입니다.",
    note: "카이사르의 유언이 후계로 삼은 사람은 이 아이가 아니라 옥타비아누스입니다.",
    aliases: ["caesarion", "ptolemy xv", "ptolemy 15", "카이사리온", "프톨레마이오스 15세"],
  },
  {
    id: "alexander-helios",
    ko: "알렉산드로스 헬리오스",
    roman: "Alexander Helios",
    band: "children",
    col: 2.2,
    y: y(11),
    years: "40년생",
    summary: "클레오파트라 7세와 안토니우스의 아들입니다. 클레오파트라 셀레네와 쌍둥이로 기원전 40년에 태어납니다.",
    aliases: ["alexander helios", "helios", "알렉산드로스 헬리오스", "헬리오스"],
  },
  {
    id: "cleopatra-selene",
    ko: "클레오파트라 셀레네",
    roman: "Cleopatra Selene",
    band: "children",
    col: 3.4,
    y: y(11),
    years: "40년생",
    summary: "클레오파트라 7세와 안토니우스의 딸이고 알렉산드로스 헬리오스의 쌍둥이입니다. 부모의 파국 뒤에 살아남아 마우레타니아 왕실로 갑니다.",
    aliases: ["cleopatra selene", "selene", "클레오파트라 셀레네", "셀레네"],
  },
  {
    id: "ptolemy-philadelphus",
    ko: "프톨레마이오스 필라델포스",
    roman: "Ptolemy Philadelphus",
    band: "children",
    col: 4.6,
    y: y(11),
    years: "36년생",
    summary: "클레오파트라 7세와 안토니우스의 아들로, 기원전 36년에 태어납니다. 위의 2세(필라델포스)와는 다른 사람입니다.",
    aliases: ["ptolemy philadelphus", "philadelphus", "프톨레마이오스 필라델포스", "필라델포스"],
  },
];

function makeChart(
  id: TreeId,
  ko: string,
  en: string,
  kind: "legend" | "history",
  lead: string,
  bands: readonly BandMeta[],
  disputes: readonly Dispute[],
  notes: readonly NameNote[],
  seeds: TreeSeed[],
  links: TreeLink[],
): FamilyChart {
  return { id, ko, en, kind, lead, disputes, notes, layout: layoutChart(id, seeds, links, bands) };
}

export const FAMILY_CHARTS: readonly FamilyChart[] = [
  makeChart(
    "myth",
    "신화",
    "Myth",
    "legend",
    "헬리오폴리스의 아홉 신(엔네아드) 줄기입니다. 아툼은 라와 한 신으로 겹칩니다. 이 탭은 신화이고, 신전 의례의 전부는 아닙니다.",
    MYTH_BANDS,
    MYTH_DISPUTES,
    MYTH_NOTES,
    MYTH_SEEDS,
    mythLinks(),
  ),
  makeChart(
    "d18",
    "18왕조",
    "Dynasty 18",
    "history",
    "아흐모세 1세에서 호렘헤브까지입니다. 아멘호테프 2세와 투트모세 4세는 투트모세 3세와 아멘호테프 3세 사이를 부자로 잇기 위해 넣었습니다. 재위 연대는 쇼(2000)의 표이고, 약입니다.",
    D18_BANDS,
    D18_DISPUTES,
    D18_NOTES,
    D18_SEEDS,
    d18Links(),
  ),
  makeChart(
    "d19",
    "19왕조",
    "Dynasty 19",
    "history",
    "람세스 1세에서 세티 1세, 람세스 2세와 네페르타리, 그리고 왕위를 이은 메르넵타까지입니다. 메르넵타의 어머니는 네페르타리가 아닙니다.",
    D19_BANDS,
    D19_DISPUTES,
    D19_NOTES,
    D19_SEEDS,
    d19Links(),
  ),
  makeChart(
    "ptolemy",
    "프톨레마이오스",
    "Ptolemies",
    "history",
    "1세에서 클레오파트라 7세와 그 자녀까지, 왕위로 이어지는 선만 그렸습니다. 해는 그리스 사료의 재위이고, 공동 통치로 겹치는 구간이 있습니다.",
    PTOLEMY_BANDS,
    PTOLEMY_DISPUTES,
    PTOLEMY_NOTES,
    PTOLEMY_SEEDS,
    ptolemyLinks(),
  ),
];

const seen = new Set<string>();
for (const chart of FAMILY_CHARTS) {
  for (const node of chart.layout.nodes) {
    if (seen.has(node.id)) throw new Error(`가계도 사이 id 중복: ${node.id}`);
    seen.add(node.id);
  }
}

export const CHRONOLOGY_NOTE =
  "신왕국 칸의 ‘약’ 연대는 이언 쇼 편 『옥스퍼드 고대 이집트사』(2000)의 표를 따릅니다. 이집트 연대는 학설마다 움직여, 그 표 하나만 정답으로 두지 않습니다. 프톨레마이오스 왕조의 해는 그리스·로마 사료로 거의 해까지 잡히므로 그 눈금을 쓰되, 공동 통치와 추방으로 구간이 갈라지는 왕은 그렇게 적었습니다. 해는 모두 기원전입니다.";

export const familyTreeSources = [
  { work: "이언 쇼 편, The Oxford History of Ancient Egypt (2000)", ref: "신왕국 재위 연대. 칸의 ‘약’" },
  { work: "피라미드 텍스트와 헬리오폴리스의 창조 신학", ref: "아툼, 슈, 테프누트, 게브, 누트, 오시리스 남매" },
  { work: "플루타르코스 『이시스와 오시리스에 대하여』", ref: "아누비스 출생의 그리스어 전승. 이집트 정본 전체는 아님" },
  { work: "Aidan Dodson, Dyan Hilton, The Complete Royal Families of Ancient Egypt (2004)", ref: "18·19왕조와 프톨레마이오스 가계의 현대 정리. 문장은 옮기지 않았습니다" },
  { work: "JAMA 2010, 투탕카멘 가계 미라 연구", ref: "KV55와 KV35 젊은 여인. 이름의 확정은 아님" },
  { work: "플루타르코스 『영웅전』", ref: "카이사르, 안토니우스. 클레오파트라 7세의 자녀" },
  { work: "조이스 틸즐리, Cleopatra: Last Queen of Egypt (2008)", ref: "어머니의 불확실함. 문장은 옮기지 않았습니다" },
] as const;

export type RelationPerson = { id: string; ko: string; roman: string; href?: string };

function personRef(layout: FamilyTreeLayout, id: string): RelationPerson {
  const node = layout.byId.get(id);
  if (!node) throw new Error(id);
  return { id: node.id, ko: node.ko, roman: node.roman, href: node.href };
}

export function relationsOf(layout: FamilyTreeLayout, id: string) {
  const byX = (a: RelationPerson, b: RelationPerson) => (layout.byId.get(a.id)?.x ?? 0) - (layout.byId.get(b.id)?.x ?? 0);
  const pick = (kind: LinkKind, direction: "from" | "to") =>
    layout.links
      .filter((link) => link.kind === kind && (direction === "to" ? link.to === id : link.from === id))
      .map((link) => personRef(layout, direction === "to" ? link.from : link.to))
      .sort(byX);
  const parents = pick("parent", "to");
  const variantParents = pick("variant-parent", "to");
  const children = pick("parent", "from");
  const variantChildren = pick("variant-parent", "from");
  const spouses = layout.links
    .filter((link) => link.kind === "spouse" && (link.from === id || link.to === id))
    .map((link) => personRef(layout, link.from === id ? link.to : link.from))
    .sort(byX);
  const variantSpouses = layout.links
    .filter((link) => link.kind === "variant-spouse" && (link.from === id || link.to === id))
    .map((link) => personRef(layout, link.from === id ? link.to : link.from))
    .sort(byX);
  const parentIds = new Set(parents.map((person) => person.id));
  const siblingIds = new Set<string>();
  for (const link of layout.links) {
    if (link.kind !== "parent" || !parentIds.has(link.from) || link.to === id) continue;
    siblingIds.add(link.to);
  }
  const siblings = [...siblingIds].map((siblingId) => personRef(layout, siblingId)).sort(byX);
  return { parents, variantParents, children, variantChildren, spouses, variantSpouses, siblings };
}

export function chartById(id: string) {
  return FAMILY_CHARTS.find((chart) => chart.id === id);
}

export function locateNode(id: string) {
  for (const chart of FAMILY_CHARTS) {
    const node = chart.layout.byId.get(id);
    if (node) return { chart, node };
  }
  return null;
}

export function searchNodes(query: string) {
  const q = norm(query);
  if (!q) return [];
  const hits: { chart: FamilyChart; node: LayoutNode; exact: boolean; prefix: boolean }[] = [];
  for (const chart of FAMILY_CHARTS) {
    for (const node of chart.layout.nodes) {
      const keys = node.keys.map(norm);
      const exact = keys.some((key) => key === q);
      const prefix = keys.some((key) => key.startsWith(q));
      const hit = exact || prefix || keys.some((key) => key.includes(q));
      if (hit) hits.push({ chart, node, exact, prefix });
    }
  }
  return hits.sort(
    (a, b) => Number(b.exact) - Number(a.exact) || Number(b.prefix) - Number(a.prefix) || a.node.ko.localeCompare(b.node.ko, "ko"),
  );
}

export function exactNode(query: string) {
  const q = norm(query);
  if (!q) return null;
  for (const chart of FAMILY_CHARTS) {
    const node = chart.layout.nodes.find((item) => item.keys.some((key) => norm(key) === q));
    if (node) return { chart, node };
  }
  return null;
}
