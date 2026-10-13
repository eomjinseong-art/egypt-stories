/** 나두연표 허브로 가는 링크. 이야기 순 영화, 주인공 실존 여부, 동시대 인물. */
const HUB = "https://nadoo-timeline.vercel.app";
const YEARS: Record<string, Record<string, number>> = {"https://egypt-stories.vercel.app/rulers/": {"narmer": -3100, "djoser": -2660, "khufu": -2578, "senusret-iii": -1858, "hatshepsut": -1468, "thutmose-iii": -1452, "akhenaten": -1344, "tutankhamun": -1328, "ramesses-ii": -1246, "ramesses-iii": -1170, "taharqa": -677, "cleopatra-vii": -40}};

export function NadooHubPersonLink({ base, slug }: { base: string; slug: string }) {
  const year = YEARS[base]?.[slug];
  const contemporaries = year ? `${HUB}/contemporaries?year=${year}` : `${HUB}/contemporaries`;
  return (
    <aside aria-label="나두연표에서 보기" className="mt-8 rounded-md border border-line p-3 text-sm">
      <a href={contemporaries} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
        동시대 인물 보기 · 나두연표 →
      </a>
      {" · "}
      <a href={`${HUB}/films`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
        연표에서 보기 (이야기 순 영화)
      </a>
      {" · "}
      <a href={`${HUB}/protagonists`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
        영화 주인공 실존 여부
      </a>
    </aside>
  );
}

export function NadooHubFilmsLink() {
  return (
    <aside aria-label="나두연표 영화 허브" className="mt-8 rounded-md border border-line p-3 text-sm">
      <a href={`${HUB}/films`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
        모든 역사 영화를 이야기 속 해 순서로 보기 · 나두연표 →
      </a>
      {" · "}
      <a href={`${HUB}/protagonists`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
        주인공은 실존 인물일까
      </a>
      {" · "}
      <a href={`${HUB}/contemporaries`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
        동시대 인물
      </a>
    </aside>
  );
}
