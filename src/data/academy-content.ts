/** Hello Music Academy 공통 콘텐츠 — hellomusic.co.kr · helloap · HelloManager PDF 기반 */

export const BRAND = {
  name: "Hello Music Academy",
  shortName: "Hello Music",
  tagline: "Play. Learn. Grow.",
  taglineKo: "연주하고, 배우고, 성장하는 피아노 학원",
  slogan: "음악으로 마음을 여는 헬로뮤직",
  phone: "02-555-2040",
  mobile: "010-5555-2040",
  email: "admin@helloapp.kr",
  kakao: "@hello_piano",
  blogUrl: "https://blog.naver.com/hellomusic0104",
  siteUrl: "https://hellomusic.co.kr/",
  address: "서울특별시 관악구 (헬로뮤직 피아노 전문 학원)",
} as const;

export const PROGRAMS = [
  {
    id: "beginner",
    title: "초급 · 어린이 피아노",
    category: "Beginner",
    description: "5~7세 바이엘 기초, 리듬·손가락 훈련, 첫 연주회까지",
    items: ["바이엘 기초", "손가락 독립", "리듬 게임", "소규모 발표회"],
    fee: "월 220,000원~",
  },
  {
    id: "intermediate",
    title: "중급 · 체르니·소곡",
    category: "Intermediate",
    description: "초등 중학년 체르니, 소나티나, 음악 이론 병행",
    items: ["체르니 30", "소나티나", "화성 입문", "듣기 훈련"],
    fee: "월 260,000원~",
  },
  {
    id: "advanced",
    title: "고급 · 클래식·콩쿠르",
    category: "Advanced",
    description: "중·고등 클래식 레퍼토리, 콩�쿠르·입시 대비",
    items: ["바흐·베ethoven", "콩쿠르 곡", "무대 연출", "녹음 피드백"],
    fee: "월 320,000원~",
  },
  {
    id: "major",
    title: "전공 · 입시반",
    category: "Major",
    description: "음대 입시, 전공 레슨, 그랜드 피아노 스튜디오",
    items: ["입시 레퍼토리", "악곡 분석", "오디션", "마스터클래스"],
    fee: "월 480,000원~",
  },
  {
    id: "adult",
    title: "성인 취미반",
    category: "Adult",
    description: "직장인·성인 취미, 원하는 곡 위주 1:1 레슨",
    items: ["POP·재즈", "원곡 연주", "유연한 시간", "1:1 맞춤"],
    fee: "월 220,000원~",
  },
  {
    id: "theory",
    title: "이론 · 화성·시창",
    category: "Theory",
    description: "Theory Room 전용 그룹·개인 이론 수업",
    items: ["시창·청음", "화성학", "악보 읽기", "시험 대비"],
    fee: "월 180,000원~",
  },
] as const;

export const VALUES = [
  {
    title: "1:1 맞춤 레슨",
    description:
      "개인 연습실에서 원장·강사가 학생 수준에 맞춘 커리큘럼을 설계합니다.",
    icon: "🎹",
  },
  {
    title: "체계적 커리큘럼",
    description:
      "초급→중급→고급→전공까지 바이엘·체르니·클래식 레퍼토리로 단계별 성장.",
    icon: "📚",
  },
  {
    title: "AI 학원 관리",
    description:
      "HelloManager 기반 등·하원·수납·알림톡 — 원장님은 음악에만 집중.",
    icon: "🤖",
  },
] as const;

/** HelloManager PDF — 사업 소개 (about/services) */
export const HELLO_MANAGER = {
  headline: "학원 운영, AI에게 맡기세요.",
  sub: "출결 · 수납 · 알림을 자연어 한 마디로. 개인정보를 지키면서 AI가 학원을 분석합니다.",
  features: [
    { title: "자연어 질의 응답", desc: '"미납자 알림 보내줘" 한 마디로 현황 조회·문자 초안 자동 생성' },
    { title: "카카오 알림톡", desc: "등·하원·수납 알림 초안 AI 생성 → 원장 [발송/수정/취소] 선택" },
    { title: "개인정보 로컬 처리", desc: "원생 정보 외부 전송 없이 학원 내부에서 안전 처리" },
    { title: "실시간 스트리밍 분석", desc: "SSE 기반 AI 분석 결과를 실시간 확인" },
    { title: "도메인 특화 AI", desc: "학원 운영 Q&A LoRA 학습으로 지속 고도화" },
    { title: "모바일 완전 지원", desc: "스마트폰으로 어디서든 학원 현황 조회·알림 발송" },
  ],
  problems: [
    "복잡한 메뉴 탐색 — 미납 확인만 해도 여러 화면",
    "알림 수동 작성 — 등·하원·수납 문자 매번 타이핑",
    "개인정보 외부 전송 — 클라우드 SaaS 리스크",
    "AI 미연동 — 데이터만 쌓이고 분석은 원장 머릿속",
  ],
} as const;

export const HOME_STATS = [
  { label: "전문 강사", value: "3" },
  { label: "연습·레슨실", value: "9" },
  { label: "수강 과정", value: "6" },
  { label: "재원 원생", value: "120+" },
] as const;
