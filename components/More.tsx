import type { ReactNode } from "react";

export function More({ children }: { children: ReactNode }) {
  return (
    <details className="group mt-4 rounded-md border border-line bg-stone/70 open:bg-stone">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-nile [&::-webkit-details-marker]:hidden">
        <span>조금만 더</span>
        <span className="text-xs font-normal text-muted group-open:hidden">펼치기</span>
        <span className="hidden text-xs font-normal text-muted group-open:inline">접기</span>
      </summary>
      <div className="prose-egypt space-y-3 px-4 pb-4 text-sm leading-7 text-ink">{children}</div>
    </details>
  );
}
