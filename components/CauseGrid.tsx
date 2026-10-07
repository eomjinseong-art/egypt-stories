import { Rich } from "@/components/Rich";

export function CauseGrid({ cause, who, result }: { cause: string; who: string; result: string }) {
  const rows = [
    { dt: "왜", dd: cause },
    { dt: "누구", dd: who },
    { dt: "결과", dd: result },
  ];
  return (
    <dl className="mt-4 grid gap-2 sm:grid-cols-3">
      {rows.map((row) => (
        <div key={row.dt} className="rounded-md border border-line bg-bg p-3">
          <dt className="text-[11px] font-medium tracking-[0.14em] text-gold">{row.dt}</dt>
          <dd className="mt-1 text-sm leading-6">
            <Rich text={row.dd} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
