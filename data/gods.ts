import type { GodCard, Guide, Source } from "@/data/types";
import { MYTH_URL } from "@/lib/site";

export const godsIntro: Guide = {
  en: "HOW TO READ",
  title: "한 신이 한 이야기만 갖지 않습니다",
  summary: "이집트 신은 도시와 세기마다 역할이 겹치고 합쳐졌습니다. 이 페이지는 길을 잡는 소개입니다. 없는 에피소드를 이어 붙여 신화를 만들지 않습니다.",
  points: [
    "라와 아문이 아문-라로 합쳐지듯, 이름은 고정된 캐릭터 카드가 아닙니다.",
    "오시리스 이야기의 가장 긴 연속 서술은 이집트 경전이 아니라 서기 2세기 플루타르코스의 그리스어 글입니다. 이집트 본문은 주문과 찬가 속에 조각을 남깁니다.",
    "그리스·로마 작가가 이집트 신에게 자기네 신의 이름을 붙인 경우가 있습니다. 그 짝은 번역이지, 두 문화의 신화가 처음부터 같은 대본이었다는 뜻은 아닙니다.",
  ],
  more: [
    "짝이 있는 신만 [나두신화](https://nadoo-myth.vercel.app)로 잇습니다. 나두신화는 그리스·로마 이야기를 다루므로, 이집트 신전의 의례 전문은 거기 있지 않습니다.",
    "세트는 어떤 글에서는 호루스의 적이고, 어떤 글에서는 태양의 배를 지키는 신입니다. ‘악신’ 한 단어로 지우면 시대가 사라집니다.",
  ],
};

export const gods: readonly GodCard[] = [
  {
    slug: "ra",
    en: "RA",
    nameKo: "라",
    egyptian: "Ra",
    summary: "태양과 연결된 신입니다. 헬리오폴리스(오늘날 카이로 북동쪽)의 큰 신이었고, 많은 창조 이야기에서 앞자리에 있습니다.",
    note: "왕 이름 안에 라가 들어가는 일이 많습니다. 낮의 태양, 저녁의 늙은 태양, 밤의 여행은 문헌마다 그림이 다릅니다. 하나의 동화 줄거리로 압축하지 않습니다.",
    links: [{ href: "/rulers/khufu", label: "이름에 라가 있는 시대 · 쿠푸" }],
  },
  {
    slug: "amun",
    en: "AMUN",
    nameKo: "아문",
    egyptian: "Amun",
    summary: "테베의 신입니다. 이름은 ‘숨은 이’에 가깝게 풀이됩니다. 신왕국에는 국가의 큰 신이 되어 라와 아문-라로 겹칩니다.",
    note: "그리스 사람은 테베의 신을 제우스라고 불렀고, 오아시스의 아문을 제우스-암몬으로 알기도 했습니다. 알렉산드로스가 시와 오아시스를 찾은 기록이 그 짝과 닿습니다. 제우스의 그리스 신화 자체는 이집트 신전의 글이 아닙니다.",
    links: [
      { href: "/map#thebes", label: "테베" },
      { href: "/wars/alexander", label: "시와 오아시스" },
      { href: `${MYTH_URL}/gods/zeus`, label: "나두신화 · 제우스" },
    ],
  },
  {
    slug: "osiris",
    en: "OSIRIS",
    nameKo: "오시리스",
    egyptian: "Osiris",
    summary: "죽은 자의 왕으로 널리 모셔졌습니다. 아비도스가 그의 큰 순례지였습니다. 왕도 죽으면 오시리스와 연결되기를 바랐습니다.",
    note: "그가 죽임을 당하고, 이시스가 그를 찾고, 아들 호루스가 세트와 다툰다는 큰 줄기는 이집트 주문과 플루타르코스의 글이 함께 가리킵니다. 상자, 나무, 잘린 몸의 세부처럼 플루타르코스에만 길게 나오는 장면은 이집트 전국의 유일한 정본으로 적지 않습니다.",
    links: [
      { href: "/daily#afterlife", label: "내세" },
      { href: `${MYTH_URL}/gods/dionysos`, label: "나두신화 · 디오니소스" },
    ],
  },
  {
    slug: "isis",
    en: "ISIS",
    nameKo: "이시스",
    egyptian: "Isis",
    summary: "오시리스의 짝이고 호루스의 어머니로 자주 등장합니다. 보호와 주문이 그의 큰 역할입니다. 나중에 로마 세계 전역에서 따로 모셔지기도 합니다.",
    note: "헤로도토스는 이시스를 그리스의 데메테르에 대응시킵니다. 로마 시대의 이시스 신앙은 이집트 신전 의례와 같은 내용이 그대로 수출된 것은 아닙니다. 데메테르의 딸 이야기는 나두신화에서 읽으면 됩니다.",
    links: [
      { href: `${MYTH_URL}/gods/demeter`, label: "나두신화 · 데메테르" },
      { href: "https://rome-stories.vercel.app/myth-links", label: "로마이야기 · 신과 전설" },
    ],
  },
  {
    slug: "horus",
    en: "HORUS",
    nameKo: "호루스",
    egyptian: "Horus",
    summary: "매의 신이고, 살아있는 왕이 호루스와 연결되었습니다. 오시리스의 아들로서 세트와 왕위를 다투는 면도 있습니다. 둘은 완전히 같은 신화 한 편이 아닙니다.",
    note: "헤로도토스는 오시리스의 아들 호루스를 그리스 사람이 아폴론이라고 부른다고 적습니다. 아이 모습의 호루스는 나중에 그리스어로 하르포크라테스라고 불립니다. 아폴론의 그리스 이야기는 따로 있습니다.",
    links: [
      { href: "/rulers", label: "살아있는 왕" },
      { href: `${MYTH_URL}/gods/apollo`, label: "나두신화 · 아폴론" },
    ],
  },
  {
    slug: "seth",
    en: "SETH",
    nameKo: "세트",
    egyptian: "Seth",
    summary: "사막, 폭풍, 바깥과 연결된 신입니다. 호루스와 왕위를 다투는 상대이면서, 어떤 주문에서는 태양의 배를 위협하는 존재를 막는 쪽에 섭니다.",
    note: "플루타르코스를 비롯한 그리스 전통은 세트를 티폰에 비깁니다. 티폰은 그리스 신화의 괴물이지, 이집트 신전의 세트가 그 괴물의 번역본으로 태어난 것은 아닙니다. 나두신화의 티폰은 그리스 이야기만 다룹니다.",
    links: [
      { href: `${MYTH_URL}/gods/typhon`, label: "나두신화 · 티폰" },
      { href: `${MYTH_URL}/stories/typhon`, label: "나두신화 · 티폰 이야기" },
    ],
  },
  {
    slug: "anubis",
    en: "ANUBIS",
    nameKo: "아누비스",
    egyptian: "Anubis",
    summary: "자칼(또는 들개) 모습으로 묘사되는, 무덤과 방부(몸을 보존하는 일)의 신입니다. 심장의 저울 장면에도 자주 나옵니다.",
    note: "로마 시대에 헤르메스와 합쳐진 헤르마누비스라는 형태가 나타납니다. 고왕국의 아누비스가 처음부터 그리스 신이었다는 뜻은 아닙니다. 헤르메스 이야기는 나두신화에 있습니다.",
    links: [
      { href: "/daily#afterlife", label: "내세의 저울" },
      { href: `${MYTH_URL}/gods/hermes`, label: "나두신화 · 헤르메스" },
    ],
  },
  {
    slug: "thoth",
    en: "THOTH",
    nameKo: "토트",
    egyptian: "Thoth",
    summary: "글자, 계산, 달, 서기와 연결된 신입니다. 헤르모폴리스가 그의 큰 도시였습니다. 신들의 서기로 묘사되는 일이 많습니다.",
    note: "그리스 사람은 토트를 헤르메스와 짝지었습니다. ‘헤르메스 트리스메기스토스’ 문헌은 더 나중, 그리스-이집트 혼합 전통입니다. 신왕국 신전의 토트와 그 문헌을 한 권의 책으로 보면 안 됩니다.",
    links: [
      { href: "/daily#writing", label: "글자" },
      { href: `${MYTH_URL}/gods/hermes`, label: "나두신화 · 헤르메스" },
    ],
  },
  {
    slug: "hathor",
    en: "HATHOR",
    nameKo: "하토르",
    egyptian: "Hathor",
    summary: "음악, 사랑, 어머니됨, 소와 연결된 여신입니다. 어떤 이야기에서는 라의 눈이자 분노한 존재로도 나타납니다. 덴데라가 그의 큰 신전 도시입니다.",
    note: "그리스-로마 시대에 아프로디테와 짝지어진 일이 있습니다. 아프로디테의 탄생 이야기나 파리스의 심판은 이집트 신화가 아닙니다.",
    links: [{ href: `${MYTH_URL}/gods/aphrodite`, label: "나두신화 · 아프로디테" }],
  },
  {
    slug: "ptah",
    en: "PTAH",
    nameKo: "프타",
    egyptian: "Ptah",
    summary: "멤피스의 신이고, 장인·창조와 연결됩니다. 샤바카 돌에 남은 글은 말이 곧 창조라는 멤피스 신학으로 자주 소개됩니다. 그 돌은 쿠시 왕조 때의 복제라고 스스로 말합니다.",
    note: "헤로도토스가 멤피스에서 헤파이스토스 신전이라고 부른 대상이 프타입니다. 헤파이스토스의 그리스 신화(대장간, 아프로디테)를 프타의 이집트 의례로 옮기지는 않습니다.",
    links: [
      { href: "/map#memphis", label: "멤피스" },
      { href: `${MYTH_URL}/gods/hephaistos`, label: "나두신화 · 헤파이스토스" },
    ],
  },
  {
    slug: "bastet",
    en: "BASTET",
    nameKo: "바스테트",
    egyptian: "Bastet",
    summary: "부바스티스의 여신입니다. 이른 시대에는 사자, 나중에는 고양이와 더 자주 연결됩니다. 헤로도토스는 그 도시의 큰 축제를 목격담처럼 적습니다.",
    note: "헤로도토스는 바스테트를 아르테미스에 대응시킵니다. 고양이를 신처럼 모신 풍습이 후기에 크게 보이는 것은 사실이지만, 모든 시대의 모든 이집트 사람이 집고양이를 신으로 키운 것은 아닙니다.",
    links: [{ href: `${MYTH_URL}/gods/artemis`, label: "나두신화 · 아르테미스" }],
  },
  {
    slug: "maat",
    en: "MAAT",
    nameKo: "마아트",
    egyptian: "Maat",
    summary: "질서, 진실, 옳음입니다. 여신으로 그려지기도 하고, 왕이 지켜야 할 상태로 말해지기도 합니다. 심장의 저울에 오르는 깃털이 마아트와 연결됩니다.",
    note: "그리스의 테미스(법과 질서의 여신)와 역할이 비슷해 보이지만, 같은 신으로 짝지어 온 전통은 이시스나 토트만큼 뚜렷하지 않습니다. 여기서는 링크 대신 구분만 적습니다. 테미스를 읽고 싶다면 나두신화의 신 목록에서 찾으면 됩니다.",
    links: [{ href: "/daily#afterlife", label: "저울 장면" }],
  },
  {
    slug: "aten",
    en: "ATEN",
    nameKo: "아텐",
    egyptian: "Aten",
    summary: "태양 원반입니다. 아케나텐 치세에 궁정의 중심으로 올라갔고, 다른 신의 공개 숭배는 밀려났습니다. 그의 죽음 뒤 옛 신전이 돌아옵니다.",
    note: "아텐 신앙을 후대의 유일신교와 같은 종교라고 부르면 시대가 섞입니다. 왕과 원반의 관계가 그 신학의 핵심으로 연구됩니다. 모세와 같은 인물이라는 주장은 고대 이집트 기록이 뒷받침하지 않습니다.",
    links: [{ href: "/rulers/akhenaten", label: "아케나텐" }],
  },
];

export const godSources: readonly Source[] = [
  { work: "피라미드 텍스트, 관 텍스트, 장례 주문", ref: "신 이름의 이른 조각" },
  { work: "헤로도토스 『역사』", ref: "2권, 이집트 신과 그리스 이름의 대응" },
  { work: "플루타르코스 『이시스와 오시리스에 대하여』", ref: "오시리스 줄거리의 긴 그리스어 서술" },
  { work: "샤바카 돌", ref: "멤피스의 프타, 후대 복제본" },
  { work: "아마르나 경계 비석과 아텐 찬가", ref: "아케나텐 시대" },
];
