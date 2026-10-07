import { Rich } from "@/components/Rich";

export function KeyPoints({ items }: { items: readonly string[] }) {
  return (
    <ol className="mt-4 grid gap-2">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3 rounded-md border border-line bg-bg px-3 py-2.5 text-sm leading-6">
          <span className="font-serif text-gold" aria-hidden>
            {index + 1}
          </span>
          <span>
            <Rich text={item} />
          </span>
        </li>
      ))}
    </ol>
  );
}
