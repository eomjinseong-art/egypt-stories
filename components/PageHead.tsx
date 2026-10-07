export function PageHead({ kicker, title, lead }: { kicker?: string; title: string; lead?: string }) {
  return (
    <div className="mt-4">
      {kicker ? <p className="text-xs tracking-[0.2em] text-gold">{kicker}</p> : null}
      <h1 className="mt-1 font-serif text-3xl leading-tight text-ink sm:text-4xl">{title}</h1>
      {lead ? <p className="mt-3 max-w-3xl text-base leading-8 text-muted">{lead}</p> : null}
    </div>
  );
}
