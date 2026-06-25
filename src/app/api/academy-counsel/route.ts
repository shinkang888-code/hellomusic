import { NextRequest, NextResponse } from "next/server";
import { getAcademyInfo, buildKnowledgeContext } from "@/lib/academy-info-db";

const DIRECTOR_SYSTEM = `당신은 Hello Music Academy 원장님입니다. 이름은 신강 원장.
말투: 따뜻하고 전문적, 학부모·수강생 상담에 맞는 존댓말.
아래 【학원 지식】만 근거로 답하세요. 모르는 내용은 "확인 후 연락드리겠습니다" 또는 전화·카카오 안내.
허구의 수업료·일정을 만들지 마세요. 블로그·공지에 없는 할인·이벤트도 약속하지 마세요.
답변은 카카오톡처럼 2~5문장, 필요 시 짧은 목록.`;

function fallbackReply(question: string, knowledge: string): string {
  const q = question.toLowerCase();
  const lines = knowledge.split("\n").filter((l) => l.trim());
  const hits = lines.filter((l) => {
    const tokens = question.replace(/[^\w가-힣\s]/g, " ").split(/\s+/);
    return tokens.some((t) => t.length > 1 && l.includes(t));
  });
  if (hits.length > 0) {
    return `안녕하세요, Hello Music 원장입니다.\n\n질문 주신 내용과 관련해 학원 안내드리면:\n${hits.slice(0, 5).join("\n")}\n\n더 궁금하신 점은 02-555-2040 또는 카카오 @hello_piano 로 편하게 문의 주세요.`;
  }
  if (q.includes("체험") || q.includes("상담")) {
    return "체험 레슨·입학 상담 환영합니다. 편하신 시간 알려주시면 Piano Practice Room 또는 Grand Studio에서 1:1로 안내드릴게요. 전화 02-555-2040, 카카오 @hello_piano 로도 예약 가능합니다.";
  }
  if (q.includes("비용") || q.includes("수강료") || q.includes("가격")) {
    return "수강료는 연령·목표·레슨 횟수에 따라 달라 1:1 상담 후 안내드리고 있습니다. 대략적인 안내가 필요하시면 연락처 남겨 주시면 원장이 직접 설명드릴게요.";
  }
  return "안녕하세요, Hello Music Academy 원장 신강입니다. 학원 프로그램·레슨·연습실 이용 등 궁금하신 점 남겨 주시면 학원 안내를 바탕으로 답변드릴게요. 급하시면 02-555-2040 으로 전화 주세요.";
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = (await req.json()) as {
      message?: string;
      history?: { role: string; content: string }[];
    };
    if (!message?.trim()) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    const row = await getAcademyInfo();
    const knowledge = buildKnowledgeContext(row);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: fallbackReply(message, knowledge),
        mode: "fallback",
      });
    }

    const histText = (history || [])
      .slice(-6)
      .map((h) => `${h.role === "user" ? "학부모" : "원장"}: ${h.content}`)
      .join("\n");

    const prompt = `${DIRECTOR_SYSTEM}

【학원 지식】
${knowledge}

【이전 대화】
${histText || "(없음)"}

【새 질문】
${message}

원장님 답변:`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
        }),
      },
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error("gemini", err);
      return NextResponse.json({
        reply: fallbackReply(message, knowledge),
        mode: "fallback",
      });
    }

    const data = (await geminiRes.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      fallbackReply(message, knowledge);

    return NextResponse.json({ reply, mode: "gemini" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "counsel failed" }, { status: 500 });
  }
}
