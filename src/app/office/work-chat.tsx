"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { type Department, type Employee } from "./types";
import { avatarFor } from "./avatars";

type LinkItem = { label: string; url: string };

type DeptBrain = {
  keywords: string[];
  summary: string;
  detail: string;
  links: LinkItem[];
};

// 부서별 업무 역할 + 검색(시뮬) 결과 링크. 라우팅이 안 되면 support(비서팀)가 응답.
const DEPT_BRAIN: Record<string, DeptBrain> = {
  engineering: {
    keywords: ["개발", "코드", "버그", "배포", "api", "서버", "빌드", "에러", "오류", "장애", "deploy"],
    summary: "코드/배포 레벨에서 즉시 처리 가능한 건으로 판단됩니다.",
    detail: "재현 → 로그 분석 → 핫픽스 PR → CI 통과 후 프로덕션 배포 순으로 진행하겠습니다.",
    links: [
      { label: "Next.js 문서", url: "https://nextjs.org/docs" },
      { label: "MDN Web Docs", url: "https://developer.mozilla.org" },
    ],
  },
  design: {
    keywords: ["디자인", "ui", "ux", "로고", "색상", "컬러", "시안", "배너", "폰트", "레이아웃"],
    summary: "브랜드 가이드 기준으로 시안 2종을 먼저 제안드리겠습니다.",
    detail: "Lonex 톤앤매너(다크 슬레이트 + 블루 액센트)를 유지하며 A/B 시안을 24시간 내 공유하겠습니다.",
    links: [
      { label: "Figma", url: "https://www.figma.com" },
      { label: "shadcn/ui", url: "https://ui.shadcn.com" },
    ],
  },
  marketing: {
    keywords: ["마케팅", "홍보", "캠페인", "sns", "콘텐츠", "블로그", "바이럴", "키워드"],
    summary: "타깃·채널·메시지 3축으로 캠페인 초안을 잡겠습니다.",
    detail: "검색 트렌드 분석 후 핵심 키워드 묶음과 콘텐츠 캘린더를 제안드리겠습니다.",
    links: [
      { label: "Google Trends", url: "https://trends.google.com" },
      { label: "Meta for Business", url: "https://business.facebook.com" },
    ],
  },
  "paid-media": {
    keywords: ["광고", "퍼포먼스", "roas", "전환", "cpc", "예산집행", "집행", "ads"],
    summary: "ROAS 목표 기준으로 예산 배분안을 먼저 산출하겠습니다.",
    detail: "캠페인별 CPC/전환율을 점검하고 저효율 세트는 즉시 끄는 방향으로 최적화하겠습니다.",
    links: [
      { label: "Google Ads", url: "https://ads.google.com" },
      { label: "Meta Ads Manager", url: "https://adsmanager.facebook.com" },
    ],
  },
  security: {
    keywords: ["보안", "해킹", "취약점", "인증", "권한", "침해", "유출", "암호", "토큰"],
    summary: "우선 영향 범위를 격리하고 취약점부터 패치하겠습니다.",
    detail: "OWASP Top 10 기준으로 점검하고, 노출된 시크릿은 즉시 로테이션하겠습니다.",
    links: [
      { label: "OWASP", url: "https://owasp.org/www-project-top-ten/" },
      { label: "NVD 취약점 DB", url: "https://nvd.nist.gov" },
    ],
  },
  finance: {
    keywords: ["재무", "정산", "비용", "예산", "회계", "세금", "매출", "원가", "환율"],
    summary: "비용/예산 영향부터 정리해 드리겠습니다.",
    detail: "월 마감 기준으로 항목별 집행 현황과 잔여 예산을 표로 정리해 공유하겠습니다.",
    links: [
      { label: "국세청 홈택스", url: "https://www.hometax.go.kr" },
      { label: "한국은행 경제통계", url: "https://ecos.bok.or.kr" },
    ],
  },
  sales: {
    keywords: ["영업", "매출", "고객", "계약", "리드", "제안서", "클로징", "딜"],
    summary: "리드 우선순위를 정리하고 제안서 초안을 준비하겠습니다.",
    detail: "파이프라인 단계별 전환율을 점검해 클로징 가능성이 높은 딜부터 챙기겠습니다.",
    links: [
      { label: "HubSpot", url: "https://www.hubspot.com" },
      { label: "Salesforce", url: "https://www.salesforce.com" },
    ],
  },
  product: {
    keywords: ["기획", "제품", "로드맵", "기능", "우선순위", "prd", "요구사항", "스펙"],
    summary: "임팩트/노력 매트릭스로 기능 우선순위를 정리하겠습니다.",
    detail: "PRD 초안과 성공 지표(KPI)를 정의해 다음 스프린트 백로그에 반영하겠습니다.",
    links: [
      { label: "Product Hunt", url: "https://www.producthunt.com" },
      { label: "Notion", url: "https://www.notion.so" },
    ],
  },
  "project-management": {
    keywords: ["일정", "마일스톤", "스프린트", "pm", "리스크", "간트", "일감", "데드라인"],
    summary: "마일스톤과 리스크를 먼저 정리해 일정표를 드리겠습니다.",
    detail: "크리티컬 패스를 식별하고 지연 리스크가 있는 작업에 버퍼를 배치하겠습니다.",
    links: [
      { label: "Jira", url: "https://www.atlassian.com/software/jira" },
      { label: "Linear", url: "https://linear.app" },
    ],
  },
  academic: {
    keywords: ["연구", "논문", "데이터셋", "학습", "모델", "학술", "벤치마크", "실험"],
    summary: "최신 논문/벤치마크를 조사해 접근법을 요약드리겠습니다.",
    detail: "관련 SOTA 모델과 데이터셋을 비교해 우리 도메인에 맞는 후보를 추리겠습니다.",
    links: [
      { label: "arXiv", url: "https://arxiv.org" },
      { label: "Hugging Face", url: "https://huggingface.co" },
    ],
  },
  specialized: {
    keywords: ["특허", "법률", "규정", "컴플라이언스", "라이선스", "계약서", "약관", "ip"],
    summary: "관련 규정/선행 특허를 검토해 리스크부터 정리하겠습니다.",
    detail: "KIPRIS 선행기술 검색과 라이선스 조항을 확인해 안전한 방향을 안내하겠습니다.",
    links: [
      { label: "KIPRIS 특허검색", url: "https://www.kipris.or.kr" },
      { label: "국가법령정보센터", url: "https://www.law.go.kr" },
    ],
  },
  "game-development": {
    keywords: ["게임", "레벨", "유니티", "언리얼", "스프라이트", "플레이", "fps"],
    summary: "프로토타입 레벨로 핵심 재미 요소부터 검증하겠습니다.",
    detail: "코어 루프를 먼저 구현해 플레이테스트 후 난이도 곡선을 조정하겠습니다.",
    links: [
      { label: "Unity Docs", url: "https://docs.unity3d.com" },
      { label: "Unreal Engine Docs", url: "https://docs.unrealengine.com" },
    ],
  },
  gis: {
    keywords: ["지도", "위치", "gis", "좌표", "공간", "지리", "경로", "지오"],
    summary: "공간 데이터 좌표계를 표준화한 뒤 시각화하겠습니다.",
    detail: "EPSG:4326 기준으로 정규화하고 레이어별 분석 결과를 지도에 표출하겠습니다.",
    links: [
      { label: "VWorld 공간정보", url: "https://www.vworld.kr" },
      { label: "OpenStreetMap", url: "https://www.openstreetmap.org" },
    ],
  },
  "spatial-computing": {
    keywords: ["ar", "vr", "xr", "3d", "헤드셋", "몰입", "메타버스", "quest"],
    summary: "디바이스 성능 한계부터 점검해 몰입 경험을 설계하겠습니다.",
    detail: "타깃 프레임레이트(72/90fps)를 확보하도록 폴리곤·드로콜 예산을 잡겠습니다.",
    links: [
      { label: "Meta Quest 개발자", url: "https://developer.oculus.com" },
      { label: "WebXR", url: "https://immersiveweb.dev" },
    ],
  },
  testing: {
    keywords: ["테스트", "qa", "품질", "검증", "자동화", "회귀", "e2e", "버그검증"],
    summary: "핵심 시나리오부터 자동화 테스트로 회귀를 막겠습니다.",
    detail: "E2E + 단위 테스트 커버리지를 점검하고 릴리스 게이트를 설정하겠습니다.",
    links: [
      { label: "Playwright", url: "https://playwright.dev" },
      { label: "Jest", url: "https://jestjs.io" },
    ],
  },
  support: {
    keywords: ["도움", "문의", "일반", "기타", "안내", "비서", "지원", "누구"],
    summary: "담당 부서를 매칭해 빠르게 연결드리겠습니다.",
    detail: "요청을 분류해 가장 적합한 팀장에게 전달하고, 진행 상황을 추적해 알려드리겠습니다.",
    links: [
      { label: "사내 위키", url: "https://www.notion.so" },
      { label: "Lonex AI 대시보드", url: "https://lonex-ai.vercel.app" },
    ],
  },
};

const FALLBACK_SLUG = "support";

function routeDept(question: string, available: Set<string>): string {
  const q = question.toLowerCase();
  let best = "";
  let bestHits = 0;
  for (const [slug, brain] of Object.entries(DEPT_BRAIN)) {
    if (!available.has(slug)) continue;
    let hits = 0;
    for (const kw of brain.keywords) {
      if (q.includes(kw.toLowerCase())) hits++;
    }
    if (hits > bestHits) {
      bestHits = hits;
      best = slug;
    }
  }
  if (bestHits === 0) {
    return available.has(FALLBACK_SLUG) ? FALLBACK_SLUG : best || "";
  }
  return best;
}

type Leader = {
  slug: string;
  name: string;
  label: string;
  color: string;
  avatar: string;
};

type ChatMessage = {
  id: number;
  role: "me" | "leader";
  leader?: Leader;
  text: string;
  links?: LinkItem[];
  time: string;
};

function now(): string {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h < 12 ? "오전" : "오후";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${hh}:${m}`;
}

export function WorkChat({
  departments,
  employees,
  onClose,
}: {
  departments: Department[];
  employees: Employee[];
  onClose: () => void;
}) {
  // 부서별 팀장(부서 내 첫 직원) + 부서 메타
  const leaders = useMemo<Leader[]>(() => {
    const repByDept = new Map<string, Employee>();
    for (const e of employees) {
      if (!repByDept.has(e.department_slug)) repByDept.set(e.department_slug, e);
    }
    return [...departments]
      .sort((a, b) => a.sort - b.sort)
      .map((d) => {
        const rep = repByDept.get(d.slug);
        return {
          slug: d.slug,
          name: rep?.name ? `${rep.name}` : `${d.label} 팀장`,
          label: d.label,
          color: d.color,
          avatar: avatarFor(d.slug),
        };
      });
  }, [departments, employees]);

  const leaderBySlug = useMemo(() => {
    const m = new Map<string, Leader>();
    leaders.forEach((l) => m.set(l.slug, l));
    return m;
  }, [leaders]);

  const availableSlugs = useMemo(
    () => new Set(leaders.map((l) => l.slug)),
    [leaders],
  );

  const idRef = useRef(1);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 0,
      role: "leader",
      leader: leaderBySlug.get(FALLBACK_SLUG) ?? leaders[0],
      text:
        "안녕하세요, 대표님 👋 업무지시방입니다.\n지시 내용을 남겨주시면 담당 팀장이 검색 후 결론부터 보고드립니다. 담당이 모호하면 비서팀이 먼저 받습니다.",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loadingLeader, setLoadingLeader] = useState<Leader | null>(null);
  const [geminiKey, setGeminiKey] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGeminiKey(localStorage.getItem("lonex_gemini_key") ?? "");
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loadingLeader]);

  function pushReply(
    leader: Leader,
    summary: string,
    detail: string,
    links: LinkItem[],
  ) {
    const replyText = detail
      ? `결론부터 말씀드리면, ${summary}\n\n📌 ${detail}`
      : `결론부터 말씀드리면, ${summary}`;
    const reply: ChatMessage = {
      id: idRef.current++,
      role: "leader",
      leader,
      text: links.length
        ? `${replyText}\n\n🔎 관련 자료를 아래 링크로 정리했습니다.`
        : replyText,
      links,
      time: now(),
    };
    setMessages((prev) => [...prev, reply]);
    setLoadingLeader(null);
  }

  async function send() {
    const text = input.trim();
    if (!text || loadingLeader) return;

    const myMsg: ChatMessage = {
      id: idRef.current++,
      role: "me",
      text,
      time: now(),
    };
    setMessages((prev) => [...prev, myMsg]);
    setInput("");

    const slug = routeDept(text, availableSlugs);
    const leader =
      leaderBySlug.get(slug) ?? leaderBySlug.get(FALLBACK_SLUG) ?? leaders[0];
    setLoadingLeader(leader);

    const brain = DEPT_BRAIN[slug] ?? DEPT_BRAIN[FALLBACK_SLUG];

    // Gemini 키가 있으면 실제 AI 답변 시도, 실패하면 기본 답변으로 폴백
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          deptLabel: leader.label,
          role: leader.label,
          apiKey: geminiKey || undefined,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          summary?: string;
          detail?: string;
          links?: LinkItem[];
          error?: string;
        };
        if (data.summary) {
          pushReply(
            leader,
            data.summary,
            data.detail ?? "",
            Array.isArray(data.links) ? data.links : [],
          );
          return;
        }
      }
    } catch {
      // 네트워크 오류 → 폴백
    }

    // 폴백: 부서 기본 답변(키 미설정/오류 시)
    window.setTimeout(() => {
      pushReply(leader, brain.summary, brain.detail, brain.links);
    }, 600);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col shadow-2xl"
        style={{ backgroundColor: "#b2c7d9" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <header className="flex items-center justify-between border-b border-black/10 bg-[#9bb3c7] px-4 py-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-1.5 text-base font-bold text-slate-900">
              💬 업무지시방
              <span className="text-xs font-normal text-slate-700">
                {leaders.length}
              </span>
            </h2>
            <p className="truncate text-[11px] text-slate-700">
              부서 팀장 {leaders.length}명 ·{" "}
              {geminiKey ? "🤖 Gemini 연결됨" : "비서팀 기본 응답 모드"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-lg text-slate-800 transition hover:bg-black/10"
            aria-label="닫기"
          >
            ✕
          </button>
        </header>

        {/* 참여자 스트립 */}
        <div className="flex gap-2 overflow-x-auto border-b border-black/10 bg-[#a7bccd] px-3 py-2">
          {leaders.map((l) => (
            <div key={l.slug} className="flex flex-col items-center gap-0.5">
              <span
                className="relative flex size-8 items-center justify-center overflow-hidden rounded-2xl bg-white ring-2"
                style={{ borderColor: l.color }}
                title={`${l.label} · ${l.name}`}
              >
                <Image
                  src={l.avatar}
                  alt={l.name}
                  width={32}
                  height={32}
                  className="size-full object-contain"
                />
              </span>
              <span className="max-w-[44px] truncate text-[8px] text-slate-700">
                {l.label}
              </span>
            </div>
          ))}
        </div>

        {/* 메시지 영역 */}
        <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
          {messages.map((m) =>
            m.role === "me" ? (
              <MyMessage key={m.id} text={m.text} time={m.time} />
            ) : (
              <LeaderMessage key={m.id} msg={m} />
            ),
          )}

          {loadingLeader && (
            <div className="flex items-end gap-2">
              <Avatar leader={loadingLeader} />
              <div className="flex flex-col">
                <span className="mb-0.5 text-[11px] text-slate-700">
                  {loadingLeader.label} · {loadingLeader.name}
                </span>
                <div className="kk-bubble-other inline-flex items-center gap-1 rounded-2xl bg-white px-4 py-2.5">
                  <span className="text-xs text-slate-500">검색 중</span>
                  <span className="kk-dot" />
                  <span className="kk-dot" style={{ animationDelay: "0.2s" }} />
                  <span className="kk-dot" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 입력창 */}
        <div className="flex items-end gap-2 border-t border-black/10 bg-white px-3 py-2.5">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="업무 지시를 입력하세요… (예: 랜딩 배너 디자인 시안 요청)"
            className="max-h-24 flex-1 resize-none rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            onClick={send}
            disabled={!input.trim() || !!loadingLeader}
            className="shrink-0 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-yellow-300 disabled:opacity-40"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

function Avatar({ leader }: { leader: Leader }) {
  return (
    <span
      className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white ring-2"
      style={{ borderColor: leader.color }}
    >
      <Image
        src={leader.avatar}
        alt={leader.name}
        width={36}
        height={36}
        className="size-full object-contain"
      />
    </span>
  );
}

function LeaderMessage({ msg }: { msg: ChatMessage }) {
  const leader = msg.leader!;
  return (
    <div className="flex items-end gap-2">
      <Avatar leader={leader} />
      <div className="flex max-w-[78%] flex-col">
        <span className="mb-0.5 text-[11px] text-slate-700">
          {leader.label} · {leader.name}
        </span>
        <div className="flex items-end gap-1.5">
          <div className="kk-bubble-other rounded-2xl bg-white px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-slate-900 shadow-sm">
            {msg.text}
            {msg.links && msg.links.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {msg.links.map((lk) => (
                  <a
                    key={lk.url}
                    href={lk.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-200 transition hover:bg-blue-100"
                  >
                    🔗 {lk.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <span className="shrink-0 text-[10px] text-slate-600">{msg.time}</span>
        </div>
      </div>
    </div>
  );
}

function MyMessage({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-end justify-end gap-1.5">
      <span className="shrink-0 text-[10px] text-slate-600">{time}</span>
      <div className="kk-bubble-me max-w-[78%] rounded-2xl bg-[#fee500] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-slate-900 shadow-sm">
        {text}
      </div>
    </div>
  );
}
