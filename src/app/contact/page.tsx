"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Nav } from "@/app/components/nav";
import { BRAND } from "@/data/academy-content";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sent");
  }

  return (
    <main className="flex-1 bg-page text-main">
      <Nav active="contact" />
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Contact
        </p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          체험 <span className="text-accent">상담</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-sub">
          1:1 체험 레슨, 학원 견학, 수강 상담을 예약해 주세요. 헬로뮤직은
          피아노 전문 1:1 레슨을 제공합니다.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-card p-6 ring-1 ring-theme"
          >
            <h2 className="text-lg font-semibold">상담 신청</h2>
            <p className="mt-1 text-sm text-sub">
              연락처와 문의 내용을 남겨주시면 담당 강사가 연락드립니다.
            </p>

            <label className="mt-6 block text-sm text-sub">
              이메일 / 연락처
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@email.com"
                className="mt-1.5 w-full rounded-lg border border-theme bg-page px-4 py-2.5 text-main placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </label>

            <label className="mt-4 block text-sm text-sub">
              문의 내용
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="체험 레슨 · 수강 과정 · 시간대 문의"
                className="mt-1.5 w-full resize-none rounded-lg border border-theme bg-page px-4 py-2.5 text-main placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </label>

            <button type="submit" className="btn-primary mt-6 w-full">
              {status === "sent" ? "접수 완료" : "상담 신청하기"}
            </button>

            {status === "sent" && (
              <p className="mt-3 text-center text-sm text-emerald-500">
                상담 신청이 접수되었습니다. 곧 연락드리겠습니다.
              </p>
            )}
          </form>

          <div className="space-y-4">
            <div className="rounded-xl bg-card p-6 ring-1 ring-theme">
              <h2 className="text-lg font-semibold">학원 연락처</h2>
              <ul className="mt-3 space-y-2 text-sm text-sub">
                <li>📞 {BRAND.phone}</li>
                <li>📱 {BRAND.mobile}</li>
                <li>✉️ {BRAND.email}</li>
                <li>💬 카카오 {BRAND.kakao}</li>
                <li>📍 {BRAND.address}</li>
              </ul>
            </div>

            <div className="rounded-xl bg-card p-6 ring-1 ring-theme">
              <h2 className="text-lg font-semibold">바로가기</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/office" className="text-accent hover:underline">
                    🎹 AI 학원 평면도
                  </Link>
                </li>
                <li>
                  <a
                    href={BRAND.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    📝 네이버 블로그
                  </a>
                </li>
                <li>
                  <a
                    href={BRAND.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    🌐 hellomusic.co.kr
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
