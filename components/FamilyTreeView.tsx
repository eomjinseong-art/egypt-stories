"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  FAMILY_CHARTS,
  exactNode,
  formatYears,
  relationsOf,
  searchNodes,
  type FamilyChart,
  type LayoutEdge,
  type LayoutNode,
  type TreeId,
} from "@/data/family-tree";

const GUEST = "#6a5c48";
const GOLD = "#8a6420";
const ROSE = "#8c3a45";
const VIOLET = "#6d4c8a";

function edgePaint(edge: LayoutEdge, active: boolean, dimming: boolean) {
  const variant = edge.kind === "variant-parent" || edge.kind === "variant-spouse";
  const spouse = edge.kind === "spouse" || edge.kind === "variant-spouse";
  const color = variant ? VIOLET : spouse ? ROSE : GOLD;
  let opacity = variant ? (edge.quiet ? 0.22 : 0.62) : spouse ? (edge.local ? 0.92 : 0.2) : edge.local ? 0.88 : edge.quiet ? 0.16 : 0.42;
  if (dimming) opacity = active ? 1 : 0.06;
  return {
    color,
    opacity,
    width: active ? 2.6 : edge.local ? 1.7 : 1.2,
    dash: variant ? "5 4" : undefined,
  };
}

function relatedSet(chart: FamilyChart, id: string) {
  const rel = relationsOf(chart.layout, id);
  const ids = new Set<string>([id]);
  for (const group of [rel.parents, rel.variantParents, rel.spouses, rel.variantSpouses, rel.children, rel.variantChildren, rel.siblings]) {
    for (const person of group) ids.add(person.id);
  }
  return ids;
}

function emptyParents(id: string) {
  if (id === "atum-ra") return "짝 없이 시작";
  if (id === "thutmose-i") return "아버지가 확인되지 않음";
  if (id === "ay" || id === "horemheb") return "혈연 선은 그리지 않음";
  return "이 그림에는 없음";
}

export function FamilyTreeView() {
  const [treeId, setTreeId] = useState<TreeId>("myth");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [openSuggest, setOpenSuggest] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const listId = useId();
  const chart = FAMILY_CHARTS.find((item) => item.id === treeId) ?? FAMILY_CHARTS[0];
  const exact = exactNode(query);
  const suggestions = exact || !query.trim() ? [] : searchNodes(query).slice(0, 8);
  const selectedNode = selected ? chart.layout.byId.get(selected) : undefined;
  const related = useMemo(() => (selected && chart.layout.byId.has(selected) ? relatedSet(chart, selected) : null), [chart, selected]);
  const relations = selected && chart.layout.byId.has(selected) ? relationsOf(chart.layout, selected) : null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focus = params.get("focus");
    const tab = params.get("tab");
    if (focus) {
      const hits = searchNodes(focus);
      const hit = exactNode(focus) ?? hits.find((item) => item.node.id === focus) ?? (hits.length === 1 ? hits[0] : null);
      if (hit) {
        setTreeId(hit.chart.id);
        setSelected(hit.node.id);
        return;
      }
    }
    if (tab && FAMILY_CHARTS.some((item) => item.id === tab)) setTreeId(tab as TreeId);
  }, []);

  useEffect(() => {
    if (!selected) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(`ft-${selected}`)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
      inline: "center",
    });
  }, [selected, treeId]);

  function writeQuery(nextTree: TreeId, focus: string | null) {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", nextTree);
    if (focus) url.searchParams.set("focus", focus);
    else url.searchParams.delete("focus");
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }

  function choose(id: string, label?: string, nextTree?: TreeId) {
    const target = nextTree ?? treeId;
    if (nextTree) setTreeId(nextTree);
    setSelected(id);
    setOpenSuggest(false);
    if (label) setQuery(label);
    writeQuery(target, id);
  }

  function onQuery(value: string) {
    setQuery(value);
    setOpenSuggest(true);
    const hit = exactNode(value);
    if (hit) choose(hit.node.id, undefined, hit.chart.id);
  }

  function showTree(next: TreeId) {
    setTreeId(next);
    setSelected(null);
    writeQuery(next, null);
    scroller.current?.scrollTo({ left: 0 });
  }

  return (
    <div>
      <div className="mt-6 flex gap-2 overflow-x-auto" role="tablist" aria-label="가계 선택">
        {FAMILY_CHARTS.map((item) => {
          const on = item.id === chart.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={on}
              aria-controls="family-tree-panel"
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${on ? "border-nile bg-nile/10 font-semibold text-nile" : "border-line bg-card text-muted hover:text-ink"}`}
              onClick={() => showTree(item.id)}
            >
              {item.ko}
              <span className="ml-1.5 text-[10px] tracking-wide text-gold">{item.en}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{chart.lead}</p>
      {chart.kind === "legend" ? <p className="mt-1 text-xs text-dusk">이 탭은 신화입니다. 왕조의 가계와 같은 사실 기록으로 읽지 않습니다.</p> : null}

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <form
          className="relative w-full max-w-md"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const hit = exactNode(query) ?? suggestions[0];
            if (hit) choose(hit.node.id, hit.node.ko, hit.chart.id);
          }}
        >
          <label htmlFor="tree-find" className="text-xs text-muted">
            이름 찾기 · Find
          </label>
          <input
            id="tree-find"
            type="search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            onFocus={() => setOpenSuggest(true)}
            placeholder="라, 하트셉수트, Tutankhamun"
            aria-label="가족관계도에서 이름 찾기"
            aria-autocomplete="list"
            aria-controls={suggestions.length > 0 ? listId : undefined}
            className="mt-1 w-full rounded-full border border-line bg-card px-4 py-2 text-sm outline-none focus:border-nile"
          />
          {openSuggest && suggestions.length > 0 ? (
            <ul id={listId} role="listbox" className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-md border border-line bg-card py-1 shadow-lg">
              {suggestions.map((hit) => (
                <li key={`${hit.chart.id}-${hit.node.id}`} role="option" aria-selected={selected === hit.node.id}>
                  <button
                    type="button"
                    className="flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-nile/5"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => choose(hit.node.id, hit.node.ko, hit.chart.id)}
                  >
                    <span className="font-serif text-ink">{hit.node.ko}</span>
                    <span className="text-xs text-muted">
                      {hit.chart.ko} · {hit.node.roman}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </form>
        <div className="flex flex-wrap gap-2" aria-label="세대로 이동">
          {chart.layout.bands.map((band) => (
            <button
              key={band.id}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1 text-xs text-ink hover:border-gold"
              onClick={() => {
                const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                document.getElementById(`band-${chart.id}-${band.id}`)?.scrollIntoView({
                  behavior: reduce ? "auto" : "smooth",
                  block: "nearest",
                  inline: "start",
                });
              }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: band.color }} aria-hidden />
              {band.ko}
              <span className="text-[10px] tracking-wide text-gold">{band.en}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
        {chart.layout.bands.map((band) => (
          <li key={band.id} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: band.color }} aria-hidden />
            {band.ko}
            <span className="text-gold">{band.en}</span>
          </li>
        ))}
        <li className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-dashed" style={{ borderColor: GUEST }} aria-hidden />
          배우자·부모로 함께 표시
        </li>
        <li className="inline-flex items-center gap-1.5">
          <svg width="28" height="8" aria-hidden>
            <line x1="0" y1="4" x2="28" y2="4" stroke={GOLD} strokeWidth="2" />
          </svg>
          부모 → 자식
        </li>
        <li className="inline-flex items-center gap-1.5">
          <svg width="28" height="8" aria-hidden>
            <line x1="0" y1="2" x2="28" y2="2" stroke={ROSE} strokeWidth="1.4" />
            <line x1="0" y1="6" x2="28" y2="6" stroke={ROSE} strokeWidth="1.4" />
          </svg>
          배우자
        </li>
        <li className="inline-flex items-center gap-1.5">
          <svg width="28" height="8" aria-hidden>
            <line x1="0" y1="4" x2="28" y2="4" stroke={VIOLET} strokeWidth="1.6" strokeDasharray="4 3" />
          </svg>
          불확실·다른 전승
        </li>
      </ul>

      <div
        ref={scroller}
        id="family-tree-panel"
        role="tabpanel"
        aria-labelledby={`tab-${chart.id}`}
        className="mt-3 cursor-grab overflow-x-auto overflow-y-hidden rounded-lg border border-line active:cursor-grabbing"
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          const target = event.target as HTMLElement;
          if (target.closest("button, a, input")) return;
          const el = scroller.current;
          if (!el) return;
          drag.current = { x: event.clientX, left: el.scrollLeft };
          el.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current || !scroller.current) return;
          scroller.current.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div id="family-tree" className="relative" style={{ width: chart.layout.width, height: chart.layout.height }}>
          {chart.layout.bands.map((band) => (
            <div
              key={band.id}
              id={`band-${chart.id}-${band.id}`}
              className="absolute left-0"
              style={{ top: band.top, height: band.height, width: chart.layout.width, background: band.soft }}
            >
              <div className="sticky left-2 top-2 z-20 w-max rounded-full border border-white/80 bg-white/90 px-3 py-1 shadow-sm">
                <span className="font-serif text-sm" style={{ color: band.color }}>
                  {band.ko}
                </span>
                <span className="ml-2 text-[10px] tracking-[0.14em] text-gold">{band.en}</span>
              </div>
            </div>
          ))}
          <svg className="absolute inset-0 z-[1]" width={chart.layout.width} height={chart.layout.height} aria-hidden>
            {chart.layout.edges.map((edge) => {
              const active = related ? related.has(edge.from) && related.has(edge.to) : false;
              const paint = edgePaint(edge, active, Boolean(related));
              const halo = related && !active ? 0 : 0.95;
              return (
                <g key={edge.id} fill="none" strokeLinecap="round">
                  <path d={edge.d} stroke="#fbf7ef" strokeWidth={paint.width + 2.4} strokeOpacity={halo} />
                  {edge.d2 ? <path d={edge.d2} stroke="#fbf7ef" strokeWidth={paint.width + 2.4} strokeOpacity={halo} /> : null}
                  <path d={edge.d} stroke={paint.color} strokeWidth={paint.width} strokeOpacity={paint.opacity} strokeDasharray={paint.dash} />
                  {edge.d2 ? <path d={edge.d2} stroke={paint.color} strokeWidth={paint.width} strokeOpacity={paint.opacity} strokeDasharray={paint.dash} /> : null}
                </g>
              );
            })}
          </svg>
          {chart.layout.nodes.map((node) => (
            <TreeCard
              key={node.id}
              node={node}
              bandColor={chart.layout.bands.find((band) => band.id === node.band)?.color ?? GOLD}
              pressed={selected === node.id}
              dimmed={Boolean(related && !related.has(node.id))}
              linked={Boolean(related && related.has(node.id) && selected !== node.id)}
              onSelect={() => choose(node.id)}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">옆으로 밀거나 드래그하면 가계도 전체가 보입니다. 칸을 누르면 부모, 배우자, 자녀, 형제가 밝아집니다.</p>

      {selectedNode && relations ? (
        <section aria-live="polite" className="fixed inset-x-3 bottom-3 z-40 max-h-[46vh] overflow-auto rounded-lg border border-line bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:w-[24rem]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-gold">
                {chart.layout.bands.find((band) => band.id === selectedNode.band)?.ko} · {chart.layout.bands.find((band) => band.id === selectedNode.band)?.en}
              </p>
              <h2 className="font-serif text-2xl text-ink">{selectedNode.ko}</h2>
              <p className="text-sm text-muted">{selectedNode.roman}</p>
              {selectedNode.years ? <p className="text-xs text-gold">{formatYears(selectedNode.years)}</p> : null}
            </div>
            <button type="button" className="rounded border border-line px-2 py-1 text-xs text-muted hover:text-ink" onClick={() => setSelected(null)}>
              닫기
            </button>
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">{selectedNode.summary}</p>
          {selectedNode.note ? <p className="mt-2 text-xs leading-5 text-dusk">불확실·다른 전승: {selectedNode.note}</p> : null}
          <div className="mt-3 space-y-2 text-sm">
            <PeopleRow
              label="부모"
              people={relations.parents}
              empty={relations.parents.length || relations.variantParents.length ? undefined : emptyParents(selectedNode.id)}
              onPick={choose}
            />
            <PeopleRow label="불확실한 부모" people={relations.variantParents} onPick={choose} />
            <PeopleRow label="배우자" people={relations.spouses} onPick={choose} />
            <PeopleRow label="불확실한 배우자" people={relations.variantSpouses} onPick={choose} />
            <PeopleRow label="자녀" people={relations.children} onPick={choose} />
            <PeopleRow label="불확실한 자녀" people={relations.variantChildren} onPick={choose} />
            <PeopleRow label="형제·자매" people={relations.siblings} onPick={choose} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedNode.href ? (
              selectedNode.href.startsWith("/") ? (
                <Link href={selectedNode.href} className="rounded-full bg-nile px-3 py-1.5 text-sm text-white hover:bg-nile-deep">
                  이 사이트의 글
                </Link>
              ) : (
                <a href={selectedNode.href} className="rounded-full bg-nile px-3 py-1.5 text-sm text-white hover:bg-nile-deep" target="_blank" rel="noopener noreferrer">
                  로마이야기에서 보기
                </a>
              )
            ) : null}
            <button type="button" className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-gold" onClick={() => setSelected(null)}>
              전체 가계도
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function PeopleRow({
  label,
  people,
  empty,
  onPick,
}: {
  label: string;
  people: { id: string; ko: string; roman: string }[];
  empty?: string;
  onPick: (id: string) => void;
}) {
  if (!people.length && !empty) return null;
  return (
    <div className="flex flex-wrap items-baseline gap-1.5">
      <span className="text-xs text-muted">{label}</span>
      {people.length ? (
        people.map((person) => (
          <button key={person.id} type="button" className="rounded-full border border-line bg-bg px-2 py-0.5 text-xs hover:border-gold" onClick={() => onPick(person.id)}>
            {person.ko}
            <span className="text-muted"> {person.roman}</span>
          </button>
        ))
      ) : (
        <span className="text-xs text-muted">{empty}</span>
      )}
    </div>
  );
}

function TreeCard({
  node,
  bandColor,
  pressed,
  dimmed,
  linked,
  onSelect,
}: {
  node: LayoutNode;
  bandColor: string;
  pressed: boolean;
  dimmed: boolean;
  linked: boolean;
  onSelect: () => void;
}) {
  const border = node.guestTag ? GUEST : bandColor;
  const external = Boolean(node.href && !node.href.startsWith("/"));
  return (
    <div id={`ft-${node.id}`} className="absolute z-10" style={{ left: node.x, top: node.y, width: node.w, height: node.h, opacity: dimmed ? 0.28 : 1, scrollMargin: "160px" }}>
      {node.badge ? <span className="absolute -top-2 left-1 z-10 rounded-full bg-[#6d4c8a] px-1.5 py-0.5 text-[9px] leading-none text-white">{node.badge}</span> : null}
      <button
        type="button"
        aria-pressed={pressed}
        onClick={onSelect}
        title={`${node.ko} / ${node.roman}${node.years ? `. ${formatYears(node.years)}` : ""}`}
        className={`flex h-full w-full flex-col items-center justify-center rounded-md border bg-white px-1 text-center ${node.href ? "pr-6" : ""}`}
        style={{
          borderColor: border,
          borderStyle: node.guestTag ? "dashed" : "solid",
          boxShadow: pressed ? `0 0 0 3px ${GOLD}` : linked ? `0 0 0 2px ${border}` : undefined,
        }}
      >
        <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-white" style={{ background: border }}>
          {node.ko.slice(0, 1)}
        </span>
        <span className="mt-0.5 line-clamp-2 max-w-full font-serif text-[12px] leading-4 text-ink">{node.ko}</span>
        <span className="max-w-full truncate text-[10px] leading-3 text-muted">{node.sub}</span>
        <span className="max-w-full truncate text-[10px] leading-3 text-gold">{node.line}</span>
      </button>
      {node.href ? (
        external ? (
          <a href={node.href} target="_blank" rel="noopener noreferrer" className="absolute bottom-1 right-1 z-10 rounded bg-white/90 px-1 text-[10px] leading-4 text-nile underline" aria-label={`${node.ko} 로마이야기`}>
            로마
          </a>
        ) : (
          <Link href={node.href} className="absolute bottom-1 right-1 z-10 rounded bg-white/90 px-1 text-[10px] leading-4 text-nile underline" aria-label={`${node.ko} 글`}>
            페이지
          </Link>
        )
      ) : null}
    </div>
  );
}
