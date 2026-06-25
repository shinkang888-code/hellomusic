"use client";

import { FormEvent, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionBadge } from "@/components/ui/SectionBadge";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sent");
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <SectionBadge>Contact</SectionBadge>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          문의 <span className="text-blue-400">하기</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-sub">
          협력, 데모, 파트너십 문의를 남겨주세요. 정식 출시 알림은 lonex AI
          대시보드 대기자 명단을 이용해 주세요.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-card p-6 ring-1 ring-theme"
          >
            <h2 className="text-lg font-semibold">회사 문의</h2>
            <p className="mt-1 text-sm text-sub">
              이메일과 메시지를 남겨주시면 검토 후 연락드립니다.
            </p>

            <label className="mt-6 block text-sm text-sub">
              이메일
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1.5 w-full rounded-lg border border-theme bg-page px-4 py-2.5 text-main placeholder:text-muted focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>

            <label className="mt-4 block text-sm text-sub">
              메시지
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="협력·데모·파트너십 문의 내용"
                className="mt-1.5 w-full resize-none rounded-lg border border-theme bg-page px-4 py-2.5 text-main placeholder:text-muted focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              {status === "sent" ? "접수 완료" : "문의 보내기"}
            </button>

            {status === "sent" && (
              <p className="mt-3 text-center text-sm text-emerald-400">
                문의가 접수되었습니다. 곧 연락드리겠습니다.
              </p>
            )}
          </form>

          <div className="space-y-4">
            <div className="rounded-xl bg-card p-6 ring-1 ring-theme">
              <h2 className="text-lg font-semibold">대기자 명단 등록</h2>
              <p className="mt-2 text-sm text-sub">
                lonex AI 정식 출시 소식은 Neon DB에 저장되는 대시보드 대기자
                명단을 이용하세요.
              </p>
              <a
                href="https://lonex-ai.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-lg bg-elevated px-5 py-2.5 text-sm font-semibold text-main ring-1 ring-theme transition hover:bg-elevated-hover"
              >
                lonex AI 대시보드 →
              </a>
            </div>

            <div className="rounded-xl bg-card p-6 ring-1 ring-theme">
              <h2 className="text-lg font-semibold">바로가기</h2>
              <ul className="mt-3 space-y-2 text-sm text-sub">
                <li>
                  <a
                    href="https://lonex-ai.vercel.app/office"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    🏢 AI 오피스
                  </a>
                </li>
                <li>
                  <a
                    href="https://lonex-ai.vercel.app/console"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    🎛 관리 콘솔
                  </a>
                </li>
                <li>
                  <a
                    href="https://huggingface.co/collections/shinkang/lonex-6a3c2d46b16593fecb629a4b"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    HF 컬렉션
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
