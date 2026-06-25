import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// gemini-2.0-flash는 이 키의 무료 한도가 0이라 429가 떠서 매번 폴백됨.
// 실제로 응답이 오는 2.5-flash 사용. env로 덮어쓸 수 있음.
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

type LinkItem = { label: string; url: string };

export async function POST(req: Request) {
  try {
    const { message, deptLabel, role, apiKey } = (await req.json()) as {
      message?: string;
      deptLabel?: string;
      role?: string;
      apiKey?: string;
    };

    const key = (apiKey ?? "").trim() || process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "no_key" }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "empty" }, { status: 400 });
    }

    const label = deptLabel || "담당";
    const sys = `너는 Lonex AI 컴퍼니의 '${label}' 팀장이자 실무 전문가다. 역할: ${role || label}.
대표(사용자)의 업무 지시·질문에 ChatGPT/Gemini처럼 충실하고 구체적인 한국어 본문으로 답한다.

출력 규칙:
- summary: 핵심 결론을 한 문장으로.
- body: 실제로 바로 사용할 수 있는 완성된 답변 본문. 마크다운 사용(제목 #, 굵게 **, 목록 -, 표 |...|).
  - 개발명세서/기획서/요구사항/계획을 요청하면 반드시 문서 형태로 상세히 작성한다.
    예) 제목 → 1. 개요/목적 → 2. 범위 → 3. 기능 요구사항 → 4. 비기능 요구사항 → 5. 데이터/API 설계 → 6. 화면/플로우 → 7. 일정 → 8. 리스크 순으로 섹션 구성.
  - 표가 도움이 되면 마크다운 표를 적극 사용한다.
  - 분량은 질문에 맞게 충분히 길게(개발명세서는 최소 400자 이상) 작성한다.
- links: 본문과 직접 관련되며 "실제로 존재하는 유명 사이트"만 0~3개. 확신이 없으면 빈 배열([])로 둔다. URL을 절대 지어내지 말 것. (예: nextjs.org, github.com, figma.com 같은 루트 도메인만)
- 지시와 무관한 엉뚱한 답을 하지 말 것.`;

    const body = {
      systemInstruction: { parts: [{ text: sys }] },
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            body: { type: "string" },
            links: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: { type: "string" },
                  url: { type: "string" },
                },
                required: ["label", "url"],
              },
            },
          },
          required: ["summary", "body"],
        },
      },
    };

    // Gemini API 키는 query param(?key=) 방식으로 인증 (AIza / AQ. 등 공통)
    const res = await fetch(
      `${BASE}/${MODEL}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("[api/chat] gemini error", res.status, errText.slice(0, 500));
      // 429(할당량 초과) 등은 클라이언트가 기본 답변으로 폴백하도록 신호
      return NextResponse.json(
        { error: "gemini_failed", status: res.status },
        { status: 502 },
      );
    }

    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsed:
      | { summary?: string; body?: string; links?: LinkItem[] }
      | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }

    if (!parsed?.summary && !parsed?.body) {
      return NextResponse.json({
        summary: "",
        body: text || "응답을 생성하지 못했습니다.",
        links: [],
      });
    }

    // 깨진/지어낸 링크 방지: https + 도메인 형태만 통과
    const links = (Array.isArray(parsed.links) ? parsed.links : [])
      .filter(
        (l) =>
          l &&
          typeof l.url === "string" &&
          /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}/i.test(l.url.trim()) &&
          typeof l.label === "string" &&
          l.label.trim().length > 0,
      )
      .slice(0, 3);

    return NextResponse.json({
      summary: parsed.summary ?? "",
      body: parsed.body ?? "",
      links,
    });
  } catch (e) {
    console.error("[api/chat]", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
