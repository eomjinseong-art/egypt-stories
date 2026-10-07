import type { Movie, MovieTopic } from "@/data/types";

export const movies: readonly Movie[] = [
  {
    slug: "the-mummy-1999",
    titleKo: "미이라",
    titleOriginal: "The Mummy",
    year: "1999",
    kind: "영화",
    why: "이집트 하면 먼저 떠오르는 모험 영화입니다. 1920년대 발굴 열기와 저주 전설이 어떻게 오락이 됐는지 볼 때 유용합니다.",
    fiction: "하무나프트라는 실존 도시가 아닙니다. 영화의 임호테프는 저주에 묶인 사제이고, 사자의 서는 마법책처럼 쓰입니다. 역사 속의 임호테프는 제3왕조 조세르 시대의 관리로, 후대에 의술의 현자로 받들어진 사람입니다. 투탕카멘의 무덤을 열면 사람들이 차례로 죽는다는 줄거리는 고대 명문이 아니라 20세기 신문에서 커진 이야기입니다. 발굴자 하워드 카터는 1939년까지 살았습니다.",
    topics: ["monuments", "rulers", "gods"],
    links: [
      { href: "/rulers/tutankhamun", label: "투탕카멘" },
      { href: "/rulers/djoser", label: "조세르와 임호테프" },
      { href: "/monuments#tombs", label: "무덤과 저주 이야기" },
    ],
  },
  {
    slug: "the-mummy-1932",
    titleKo: "미이라",
    titleOriginal: "The Mummy",
    year: "1932",
    kind: "영화",
    why: "보리스 칼로프가 나온 이 작품이, 되살아난 미라라는 현대 이미지를 일찍 고정했습니다. 1999년 영화의 할아버지뻘입니다.",
    fiction: "줄거리의 임호테프와 부활은 창작입니다. 고대 이집트 장례는 되살아나 복수하는 괴물을 만들기 위한 절차가 아니었습니다. 제목만 같고 해가 다른 1999년 작품과 같은 이야기로 보면 안 됩니다.",
    topics: ["monuments", "rulers"],
    links: [
      { href: "/monuments#tombs", label: "무덤" },
      { href: "/daily#afterlife", label: "내세" },
    ],
  },
  {
    slug: "cleopatra-1963",
    titleKo: "클레오파트라",
    titleOriginal: "Cleopatra",
    year: "1963",
    kind: "영화",
    why: "카이사르, 안토니우스, 알렉산드리아, 악티움으로 이어지는 큰 그림을 화려한 화면으로 따라갈 수 있습니다.",
    fiction: "정치보다 연애가 앞에 놓입니다. 입성 장면의 규모와 대사는 고대 기록을 그대로 재연한 것이 아닙니다. 플루타르코스는 그가 침구 자루에 말려 카이사르에게 들어갔다고 전하는데, 영화가 고른 카펫은 그 이야기의 후대 각색입니다. 죽음의 뱀도 여러 전승 가운데 하나입니다. 역사 정리는 이 사이트의 클레오파트라 글과 로마이야기를 보세요.",
    topics: ["cleopatra", "wars", "rulers"],
    links: [
      { href: "/cleopatra", label: "클레오파트라와 로마" },
      { href: "/rulers/cleopatra-vii", label: "클레오파트라 7세" },
      { href: "/wars/rome", label: "로마의 병합" },
      { href: "https://rome-stories.vercel.app/cleopatra", label: "로마이야기 · 클레오파트라" },
    ],
  },
  {
    slug: "prince-of-egypt",
    titleKo: "이집트 왕자",
    titleOriginal: "The Prince of Egypt",
    year: "1998",
    kind: "애니메이션",
    why: "드림웍스의 애니메이션입니다. 히브리 성경의 출애굽기가 노래와 그림으로 어떻게 전달되는지 볼 때 많이 찾습니다. 극으로서의 완성도와, 신왕국 연대기는 다른 질문입니다.",
    fiction: "신앙의 이야기를 각색한 작품이지 이집트 왕실의 기록이 아닙니다. 성경은 그 파라오의 이름을 적지 않는데, 영화는 람세스를 형제로 설정합니다. 고고학과 이집트 문헌은 성경이 말하는 규모의 출애굽을 확인해 주지 못했습니다. 히브리 사람의 기억과 이집트 궁정의 연보를 한 날짜에 겹쳐 외우지 않는 편이 맞습니다. 나중에 비디오로 나온 요셉 이야기가 가끔 ‘이집트 왕자 2’로 불린 적이 있으나, 다른 성경 이야기이고 이 작품의 공식 속편은 아닙니다.",
    topics: ["rulers"],
    links: [
      { href: "/rulers/ramesses-ii", label: "람세스 2세" },
      { href: "/movies#the-ten-commandments", label: "실사 출애굽 영화" },
    ],
  },
  {
    slug: "the-ten-commandments",
    titleKo: "십계",
    titleOriginal: "The Ten Commandments",
    year: "1956",
    kind: "영화",
    why: "세실 B. 데밀의 큰 화면이, 많은 사람에게 출애굽의 첫 이미지였습니다. 율 브리너가 맡은 람세스가 그 예입니다.",
    fiction: "성경 서사극입니다. 파라오의 이름, 궁정 음모, 공사의 규모는 극이 채운 부분입니다. 피라미드를 이 시대의 노예가 쌓는 장면으로 기억하면 연대가 어긋납니다. 기자 피라미드는 고왕국, 람세스가 실존한다면 신왕국으로 천 년 가까이 떨어져 있습니다. 신앙의 장면을 발굴 보고서로 쓰지 않으면 됩니다.",
    topics: ["rulers", "monuments"],
    links: [
      { href: "/rulers/ramesses-ii", label: "람세스 2세" },
      { href: "/monuments#pyramids", label: "피라미드의 시대" },
    ],
  },
  {
    slug: "exodus-gods-and-kings",
    titleKo: "엑소더스: 신들과 왕들",
    titleOriginal: "Exodus: Gods and Kings",
    year: "2014",
    kind: "영화",
    why: "리들리 스콧의 실사 영화로, 출애굽을 다시 큰 스펙터클로 만납니다. 조엘 에저튼이 람세스를 맡습니다.",
    fiction: "『이집트 왕자』와 마찬가지로 성경 이야기의 영화입니다. 형제의 우정, 전투, 재앙의 화면은 각색입니다. 람세스 2세의 카데시 전투나 히타이트 조약과 이 영화를 같은 사건으로 잇지 마세요. 카데시는 [전쟁](/wars/kadesh)에 따로 있습니다.",
    topics: ["rulers"],
    links: [
      { href: "/rulers/ramesses-ii", label: "람세스 2세" },
      { href: "/wars/kadesh", label: "카데시" },
    ],
  },
  {
    slug: "gods-of-egypt",
    titleKo: "갓 오브 이집트",
    titleOriginal: "Gods of Egypt",
    year: "2016",
    kind: "영화",
    why: "호루스와 세트라는 이름이 나온다는 이유로 이집트 신화 입문처럼 보이기 쉽습니다. 그래서 오히려 구분이 필요합니다.",
    fiction: "판타지 액션입니다. 신의 키, 눈을 빼앗는 전투, 도둑 주인공의 모험은 고대 문헌의 줄거리가 아닙니다. 세트와 호루스가 다툰다는 큰 주제만 이집트 쪽에 뿌리가 있고, 나머지 설정은 영화가 만들었습니다. 신화를 이 각본으로 외우지 않는 편이 좋습니다. 기록에 남은 범위는 [신](/gods)에 짧게 적어 두었습니다.",
    topics: ["gods", "monuments"],
    links: [{ href: "/gods", label: "이집트 신" }],
  },
  {
    slug: "alexander-2004",
    titleKo: "알렉산더",
    titleOriginal: "Alexander",
    year: "2004",
    kind: "영화",
    why: "올리버 스톤의 전기 영화입니다. 이집트 입성과 시와 오아시스가 긴 삶의 한 장면으로 나옵니다.",
    fiction: "전투와 사생활은 각색이 큽니다. 시와 신탁이 알렉산드로스에게 무슨 말을 했는지는 고대 기록도 공개하지 않습니다. 영화의 대사를 신탁의 대답으로 외우지 마세요. 이집트에서의 짧은 체류와, 그 뒤 프톨레마이오스 왕조가 삼백 년 이어진 일은 별개입니다.",
    topics: ["wars", "origins"],
    links: [
      { href: "/wars/alexander", label: "알렉산드로스" },
      { href: "/origins#ptolemaic", label: "프톨레마이오스 시대" },
      { href: "https://greece-stories.vercel.app", label: "그리스이야기" },
    ],
  },
];

const bySlug = new Map(movies.map((movie) => [movie.slug, movie]));

export function moviesByTopic(topic: MovieTopic) {
  return movies.filter((movie) => movie.topics.includes(topic));
}

export function moviesBySlugs(slugs: readonly string[]) {
  return slugs.flatMap((slug) => {
    const movie = bySlug.get(slug);
    return movie ? [movie] : [];
  });
}
