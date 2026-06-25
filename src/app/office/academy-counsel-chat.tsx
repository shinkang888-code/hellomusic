"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const DIRECTOR = {
  name: "김원장",
  label: "원장실",
  avatar: "/characters/chibi/director-male.png",
  color: "#9B2335",
};

type Msg = {
  id: string;
  role: "me" | "director";
  text: string;
  time: string;
};

function nowTime() {
  return new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function mdToHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AcademyCounselChat({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "director",
      text: "안녕하세요, Hello Music Academy **김원장**입니다 🎹\n레슨·입학·연습실·체험 상담 무엇이든 편하게 물어보세요.",
      time: nowTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  if (!open) return null;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "me", text, time: nowTime() };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const history = [...messages, userMsg]
        .filter((x) => x.id !== "welcome" || messages.length > 1)
        .slice(-8)
        .map((x) => ({
          role: x.role === "me" ? "user" : "assistant",
          content: x.text.replace(/\*\*/g, ""),
        }));
      const res = await fetch("/api/academy-counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      const reply =
        data.reply ||
        "잠시 연결이 불안정합니다. 02-555-2040 또는 카카오 @hello_piano 로 문의해 주세요.";
      setMessages((m) => [
        ...m,
        {
          id: `d-${Date.now()}`,
          role: "director",
          text: reply,
          time: nowTime(),
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `e-${Date.now()}`,
          role: "director",
          text: "답변 생성 중 오류가 났습니다. 전화 02-555-2040 으로 연락 주시면 원장이 직접 안내드릴게요.",
          time: nowTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
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
        <header className="flex items-center justify-between border-b border-black/10 bg-[#9bb3c7] px-4 py-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-1.5 text-base font-bold text-slate-900">
              🎹 학원상담
            </h2>
            <p className="truncate text-[11px] text-slate-700">
              {DIRECTOR.label} · {DIRECTOR.name} 원장님이 답변합니다
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-lg text-slate-800 transition hover:bg-black/10"
            aria-label="닫기"
          >
            ✕
          </button>
        </header>

        <div className="flex items-center gap-3 border-b border-black/10 bg-[#a7bccd] px-4 py-2.5">
          <span
            className="relative flex size-10 items-center justify-center overflow-hidden rounded-2xl bg-white ring-2"
            style={{ borderColor: DIRECTOR.color }}
          >
            <Image
              src={DIRECTOR.avatar}
              alt={DIRECTOR.name}
              width={40}
              height={40}
              className="size-full object-contain"
            />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">{DIRECTOR.name}</p>
            <p className="text-[10px] text-slate-600">
              학원정보·블로그 기반 AI 상담
            </p>
          </div>
        </div>

        <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
          {messages.map((m) =>
            m.role === "me" ? (
              <div key={m.id} className="flex justify-end">
                <div className="flex max-w-[78%] flex-col items-end">
                  <div
                    className="rounded-2xl bg-[#fee500] px-3.5 py-2.5 text-sm text-slate-900 shadow-sm"
                    style={{ borderTopRightRadius: 4 }}
                  >
                    {m.text}
                  </div>
                  <span className="mt-0.5 text-[10px] text-slate-600">{m.time}</span>
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex items-end gap-2">
                <span
                  className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white ring-2"
                  style={{ borderColor: DIRECTOR.color }}
                >
                  <Image
                    src={DIRECTOR.avatar}
                    alt=""
                    width={36}
                    height={36}
                    className="size-full object-contain"
                  />
                </span>
                <div className="flex max-w-[78%] flex-col">
                  <span className="mb-0.5 text-[11px] text-slate-700">
                    {DIRECTOR.label} · {DIRECTOR.name}
                  </span>
                  <div className="flex items-end gap-1.5">
                    <div
                      className="rounded-2xl bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 shadow-sm"
                      style={{ borderTopLeftRadius: 4 }}
                      dangerouslySetInnerHTML={{ __html: mdToHtml(m.text) }}
                    />
                    <span className="shrink-0 text-[10px] text-slate-600">{m.time}</span>
                  </div>
                </div>
              </div>
            ),
          )}
          {loading && (
            <div className="flex items-end gap-2">
              <span
                className="flex size-9 items-center justify-center rounded-2xl bg-white ring-2"
                style={{ borderColor: DIRECTOR.color }}
              >
                <Image src={DIRECTOR.avatar} alt="" width={36} height={36} />
              </span>
              <div className="rounded-2xl bg-white px-4 py-2.5 text-xs text-slate-500">
                원장님이 답변 작성 중…
              </div>
            </div>
          )}
        </div>

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
            placeholder="레슨·입학·체험 등 궁금한 점을 입력하세요…"
            className="max-h-24 flex-1 resize-none rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || loading}
            className="shrink-0 rounded-xl bg-[#9B2335] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#7a1c2a] disabled:opacity-40"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
