// 직원/부서 영문 → 한글 변환 (단어 사전 기반). 재실행 가능.
// 실행: DATABASE_URL=... node scripts/translate-ko.mjs
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL 필요");
  process.exit(1);
}
const sql = neon(databaseUrl);

const DEPT_KO = {
  academic: "학술팀",
  design: "디자인팀",
  engineering: "엔지니어링팀",
  finance: "재무팀",
  "game-development": "게임개발팀",
  gis: "공간정보(GIS)팀",
  marketing: "마케팅팀",
  "paid-media": "유료광고팀",
  product: "프로덕트팀",
  "project-management": "프로젝트관리팀",
  sales: "영업팀",
  security: "보안팀",
  "spatial-computing": "공간컴퓨팅팀",
  specialized: "전문팀",
  support: "고객지원팀",
  testing: "품질테스트팀",
};

// 대문자 유지 약어
const ACRONYMS = new Set([
  "ai","gis","xr","ux","ui","qa","seo","cms","cto","ceo","cfo","coo","crm",
  "erp","api","ml","nlp","llm","ar","vr","it","hr","pm","po","sre","devops",
]);

// 단어 사전 (소문자 키)
const W = {
  engineer: "엔지니어", strategist: "전략가", specialist: "전문가",
  architect: "아키텍트", developer: "개발자", manager: "매니저",
  analyst: "분석가", data: "데이터", designer: "디자이너", agent: "에이전트",
  optimizer: "최적화전문가", intelligence: "인텔리전스", integration: "통합",
  workflow: "워크플로우", spatial: "공간", coach: "코치", auditor: "감사관",
  sales: "영업", security: "보안", officer: "책임자", customer: "고객",
  legal: "법률", researcher: "연구원", optimization: "최적화",
  service: "서비스", builder: "빌더", senior: "시니어", technical: "기술",
  consultant: "컨설턴트", content: "콘텐츠", growth: "그로스",
  commerce: "커머스", operator: "운영자", compliance: "컴플라이언스",
  psychologist: "심리학자", prompt: "프롬프트", onboarding: "온보딩",
  shopping: "쇼핑", cart: "장바구니", email: "이메일", incident: "장애",
  change: "변경", app: "앱", multi: "멀티", writer: "작가",
  wechat: "위챗", financial: "금융", game: "게임", reality: "리얼리티",
  agentic: "에이전트형", search: "검색", engine: "엔진", china: "차이나",
  market: "마켓", creator: "크리에이터", marketing: "마케팅",
  podcast: "팟캐스트", video: "비디오", social: "소셜", media: "미디어",
  twitter: "트위터", account: "어카운트", paid: "유료", buyer: "바이어",
  tracking: "트래킹", tracker: "트래커", steward: "관리자", project: "프로젝트",
  studio: "스튜디오", operations: "운영", responder: "대응자",
  tester: "테스터", threat: "위협", identity: "아이덴티티",
  business: "비즈니스", chief: "최고책임자", healthcare: "헬스케어",
  billing: "빌링", document: "문서", generator: "생성기",
  navigator: "내비게이터", checker: "검사기", anthropologist: "인류학자",
  geographer: "지리학자", historian: "역사학자", narratologist: "서사학자",
  brand: "브랜드", guardian: "가디언", image: "이미지", inclusive: "포용",
  visuals: "비주얼", persona: "페르소나", walkthrough: "워크스루",
  visual: "비주얼", storyteller: "스토리텔러", whimsy: "위트",
  injector: "인젝터", remediation: "교정", autonomous: "자율",
  backend: "백엔드", frontend: "프론트엔드", cms: "CMS", code: "코드",
  reviewer: "리뷰어", codebase: "코드베이스", database: "데이터베이스",
  automator: "자동화전문가", drupal: "드루팔", embedded: "임베디드",
  firmware: "펌웨어", feishu: "페이슈", filament: "필라멘트", git: "Git",
  master: "마스터", minimal: "미니멀", commander: "지휘관",
  response: "대응", data_engineer: "데이터엔지니어", devrel: "데브렐",
  full: "풀", stack: "스택", mobile: "모바일", web: "웹", cloud: "클라우드",
  platform: "플랫폼", infrastructure: "인프라", systems: "시스템",
  system: "시스템", network: "네트워크", performance: "성능",
  quality: "품질", assurance: "보증", automation: "자동화",
  test: "테스트", testing: "테스트", deployment: "배포", release: "릴리스",
  product: "프로덕트", owner: "오너", lead: "리드", head: "헤드",
  director: "디렉터", coordinator: "코디네이터", planner: "기획자",
  facilitator: "퍼실리테이터", scrum: "스크럼", sprint: "스프린트",
  finance: "재무", accountant: "회계사", investment: "투자",
  investor: "투자", relations: "관계", revenue: "매출", pricing: "가격",
  forecasting: "예측", budget: "예산", payroll: "급여", tax: "세무",
  copywriter: "카피라이터", copy: "카피", influencer: "인플루언서",
  community: "커뮤니티", outreach: "아웃리치", campaign: "캠페인",
  ads: "광고", ad: "광고", advertising: "광고", performance_marketer: "퍼포먼스마케터",
  conversion: "전환", funnel: "퍼널", retention: "리텐션",
  acquisition: "고객확보", engagement: "인게이지먼트", analytics: "애널리틱스",
  insights: "인사이트", reporting: "리포팅", dashboard: "대시보드",
  geospatial: "지리공간", mapping: "매핑", cartographer: "지도제작자",
  remote: "원격", sensing: "센싱", surveyor: "측량사", geodata: "지오데이터",
  computing: "컴퓨팅", immersive: "몰입형", metaverse: "메타버스",
  experience: "경험", interaction: "인터랙션", hardware: "하드웨어",
  robotics: "로보틱스", iot: "IoT", sensor: "센서", firmware_engineer: "펌웨어엔지니어",
  support: "지원", helpdesk: "헬프데스크", success: "성공",
  technical_writer: "테크니컬라이터", knowledge: "지식", base: "베이스",
  vulnerability: "취약점", penetration: "침투", pentest: "모의해킹",
  forensics: "포렌식", privacy: "프라이버시", governance: "거버넌스",
  risk: "리스크", fraud: "사기탐지", access: "접근", management: "관리",
  cryptography: "암호", encryption: "암호화", soc: "보안관제",
  marketer: "마케터", representative: "담당자", rep: "담당자",
  executive: "임원", associate: "어소시에이트", junior: "주니어",
  principal: "수석", staff: "스태프", expert: "전문가",
  scientist: "과학자", machine: "머신", learning: "러닝", vision: "비전",
  language: "언어", model: "모델", model_engineer: "모델엔지니어",
  pipeline: "파이프라인", mlops: "MLOps", llmops: "LLMOps",
  recommendation: "추천", personalization: "개인화", chatbot: "챗봇",
  assistant: "어시스턴트", copilot: "코파일럿", orchestration: "오케스트레이션",
  orchestrator: "오케스트레이터", evaluation: "평가", evaluator: "평가자",
  fine: "파인", tuning: "튜닝", training: "학습", trainer: "트레이너",
  inference: "추론", embedding: "임베딩", vector: "벡터", retrieval: "검색",
  rag: "RAG", knowledge_engineer: "지식엔지니어", solution: "솔루션",
  solutions: "솔루션", enterprise: "엔터프라이즈", saas: "SaaS",
  shopify: "쇼피파이", wordpress: "워드프레스", react: "리액트",
  node: "노드", python: "파이썬", java: "자바", api_developer: "API개발자",
  ecommerce: "이커머스", "e-commerce": "이커머스", store: "스토어",
  payment: "결제", checkout: "체크아웃", subscription: "구독",
  growth_hacker: "그로스해커", hacker: "해커", ops: "운영",
  reliability: "신뢰성", site: "사이트", monitoring: "모니터링",
  observability: "관측성", logging: "로깅", alerting: "알림",
  migration: "마이그레이션", refactoring: "리팩터링", modernization: "현대화",
  legacy: "레거시", debugging: "디버깅", profiling: "프로파일링",
  scaling: "확장", capacity: "용량", load: "부하", stress: "스트레스",
  benchmark: "벤치마크", accessibility: "접근성", localization: "현지화",
  internationalization: "국제화", translation: "번역", translator: "번역가",
  voice: "보이스", speech: "음성", audio: "오디오", image_generator: "이미지생성기",
  generative: "생성형", diffusion: "디퓨전", gan: "GAN",
  curator: "큐레이터", librarian: "사서", archivist: "아키비스트",
  editor: "에디터", proofreader: "교정자", ghostwriter: "고스트라이터",
  journalist: "기자", reporter: "리포터", newsletter: "뉴스레터",
  blog: "블로그", blogger: "블로거", scriptwriter: "각본가",
  animator: "애니메이터", illustrator: "일러스트레이터", artist: "아티스트",
  motion: "모션", graphic: "그래픽", graphics: "그래픽", 3: "3", d: "D",
  typography: "타이포그래피", layout: "레이아웃", wireframe: "와이어프레임",
  prototype: "프로토타입", prototyper: "프로토타이퍼", usability: "사용성",
  user: "사용자", research_engineer: "리서치엔지니어", insight: "인사이트",
  whisperer: "위스퍼러", wizard: "위저드", ninja: "닌자", guru: "구루",
  champion: "챔피언", advocate: "애드보킷", evangelist: "에반젤리스트",
  ambassador: "앰배서더", liaison: "연락담당", partner: "파트너",
  partnerships: "파트너십", alliance: "제휴", deal: "딜", negotiation: "협상",
  negotiator: "협상가", contract: "계약", procurement: "조달",
  vendor: "벤더", supplier: "공급사", logistics: "물류",
  supply: "공급", chain: "체인", inventory: "재고", warehouse: "창고",
  fulfillment: "풀필먼트", shipping: "배송", delivery: "배송",
  ecosystem: "에코시스템", a: "", an: "", the: "", of: "",
  and: "·", for: "", with: "", in: "", to: "", "&": "·",
  intelligence_engineer: "인텔리전스엔지니어",
};

for (const a of ["seo","cms","sre","bim","aeo","geoai","esg","ppc","lsp","mcp","api","secops","macos","visionos","ppc"]) ACRONYMS.add(a);

Object.assign(W, {
  software: "소프트웨어", rapid: "래피드", solidity: "솔리디티", smart: "스마트",
  mini: "미니", program: "프로그램", narrative: "내러티브", scene: "씬",
  cartography: "지도제작", drone: "드론", geoprocessing: "지오프로세싱",
  foundations: "파운데이션", zhihu: "즈후", baidu: "바이두", bilibili: "비리비리",
  book: "북", author: "작가", carousel: "캐러셀", douyin: "더우인",
  global: "글로벌", instagram: "인스타그램", kuaishou: "콰이쇼우",
  linkedin: "링크드인", publisher: "퍼블리셔", communications: "커뮤니케이션",
  private: "프라이빗", domain: "도메인", reddit: "레딧", short: "숏",
  editing: "편집", tiktok: "틱톡", engager: "인게이저", weibo: "웨이보",
  xiaohongshu: "샤오훙수", creative: "크리에이티브", programmatic: "프로그래매틱",
  display: "디스플레이", query: "쿼리", measurement: "측정", feedback: "피드백",
  synthesizer: "신디사이저", prioritizer: "우선순위전문가", trend: "트렌드",
  experiment: "실험", jira: "지라", meeting: "회의", notes: "노트",
  shepherd: "셰퍼드", discovery: "디스커버리", offer: "오퍼", gen: "생성",
  outbound: "아웃바운드", proposal: "제안", application: "애플리케이션",
  blockchain: "블록체인", detection: "탐지", metal: "메탈", terminal: "터미널",
  cockpit: "콕핏", interface: "인터페이스", payable: "지급", trust: "신뢰",
  corporate: "기업", consolidation: "통합", sustainability: "지속가능성",
  government: "정부", digital: "디지털", presales: "프리세일즈", grant: "보조금",
  hospitality: "호스피탈리티", guest: "게스트", graph: "그래프",
  client: "클라이언트", intake: "인테이크", review: "리뷰", index: "인덱스",
  medical: "의료", coding: "코딩", organizational: "조직", personal: "퍼스널",
  mentor: "멘토", real: "부동산", estate: "", seller: "셀러",
  recruitment: "채용", report: "리포트", distribution: "유통", retail: "리테일",
  returns: "반품", extraction: "추출", cultural: "문화", french: "프랑스어",
  consulting: "컨설팅", korean: "한국어", salesforce: "세일즈포스",
  strategy: "전략", duel: "듀얼", behavioral: "행동", nudge: "넛지",
  bookkeeper: "경리", controller: "컨트롤러", maintainer: "메인테이너",
  evidence: "증거", collector: "수집기", benchmarker: "벤치마커", tool: "툴",
  level: "레벨", citation: "인용", cross: "국경간", border: "",
  livestream: "라이브스트림", official: "공식", producer: "프로듀서",
  time: "타임", loan: "대출", civil: "시민", study: "유학", abroad: "",
  advisor: "어드바이저", summary: "요약", results: "결과", analyzer: "분석기",
  orgscript: "오그스크립트",
});

function translateName(en) {
  const tokens = en.split(/(\s+|\/|&|-|\(|\))/);
  const out = tokens.map((t) => {
    const key = t.toLowerCase().replace(/[()]/g, "").trim();
    if (!key) return t;
    if (t === "/" || t === "-") return " ";
    if (t === "&") return "·";
    if (ACRONYMS.has(key)) return key.toUpperCase();
    if (W[key] !== undefined) return W[key];
    // 끝의 복수형 s 제거 시도
    if (key.endsWith("s") && W[key.slice(0, -1)] !== undefined)
      return W[key.slice(0, -1)];
    return t; // 미등록 단어는 원문 유지
  });
  return out
    .join("")
    .replace(/\s+/g, " ")
    .replace(/\s*·\s*/g, "·")
    .trim();
}

async function main() {
  await sql`ALTER TABLE employees ADD COLUMN IF NOT EXISTS name_en TEXT`;
  await sql`ALTER TABLE departments ADD COLUMN IF NOT EXISTS label_en TEXT`;

  // 부서
  for (const [slug, ko] of Object.entries(DEPT_KO)) {
    await sql`UPDATE departments SET label_en = COALESCE(label_en, label), label = ${ko} WHERE slug = ${slug}`;
  }
  console.log(`부서 ${Object.keys(DEPT_KO).length}개 한글화`);

  // 직원: name_en 보존 후 한글화
  const rows = await sql`SELECT id, name, name_en FROM employees`;
  let n = 0;
  for (const r of rows) {
    const en = r.name_en || r.name;
    const ko = translateName(en);
    await sql`UPDATE employees SET name_en = ${en}, name = ${ko} WHERE id = ${r.id}`;
    n++;
  }
  console.log(`직원 ${n}명 한글화 완료`);

  const sample = await sql`SELECT name_en, name FROM employees ORDER BY id LIMIT 12`;
  console.log("\n샘플:");
  for (const s of sample) console.log(`  ${s.name_en}  →  ${s.name}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
