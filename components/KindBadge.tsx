import type { Kind } from "@/data/types";

const LABEL: Record<Kind, string> = {
  legend: "전설",
  history: "역사",
  mixed: "전설과 역사가 섞임",
};

const CLASS_NAME: Record<Kind, string> = {
  legend: "border-dusk/40 bg-dusk/10 text-dusk",
  history: "border-nile/40 bg-nile/10 text-nile",
  mixed: "border-gold/40 bg-gold/10 text-gold",
};

export function KindBadge({ kind }: { kind: Kind }) {
  return (
    <span className={`inline-block rounded-sm border px-1.5 py-0.5 text-[10px] font-medium tracking-wide ${CLASS_NAME[kind]}`}>
      {LABEL[kind]}
    </span>
  );
}
