"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "등록에 실패했습니다.");
        return;
      }

      setStatus("success");
      setMessage("등록되었습니다. 감사합니다!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("네트워크 오류가 발생했습니다.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-lg bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 ring-1 ring-slate-700 outline-none focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
      >
        {status === "loading" ? "등록 중..." : "등록"}
      </button>
      {message && (
        <p
          className={`text-sm sm:absolute sm:mt-12 ${
            status === "success" ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
