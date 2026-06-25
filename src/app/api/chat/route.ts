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
    const sys = `너는 Lonex AI 컴퍼니의 '${label}' 팀장이다. 역할: ${role || label} 전문가.
대표(사용자)의 업무 지시·질문에 대해 너의 부서 전문성으로 정확히 답한다.
규칙:
- 반드시 한국어로 답한다.
- summary: 결론부터 한 문장으로 명확히.
- detail: 2~3문장으로 구체적 실행 계획 또는 근거.
- links: 질문과 직접 관련된 실제 사이트 1~3개(label, url). url은 https로 시작하는 실재하는 도메인만.
- 지시와 무관한 엉뚱한 답을 절대 하지 말 것. 모르면 모른다고 하고 비서팀 연결을 제안한다.`;

    const body = {
      systemInstruction: { parts: [{ text: sys }] },
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        temperature: 0.6,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            detail: { type: "string" },
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
          required: ["summary", "detail"],
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

    let parsed: { summary?: string; detail?: string; links?: LinkItem[] } | null =
      null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }

    if (!parsed?.summary) {
      return NextResponse.json({
        summary: text || "응답을 생성하지 못했습니다.",
        detail: "",
        links: [],
      });
    }

    return NextResponse.json({
      summary: parsed.summary,
      detail: parsed.detail ?? "",
      links: Array.isArray(parsed.links) ? parsed.links.slice(0, 3) : [],
    });
  } catch (e) {
    console.error("[api/chat]", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
