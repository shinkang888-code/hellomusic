"use client";

import { useCallback, useState } from "react";

type LaunchMode = "sso" | "login" | "fallback";

export function HelloManagerButton() {
  const [opening, setOpening] = useState(false);

  const openHelloManager = useCallback(async () => {
    if (opening) return;
    setOpening(true);
    try {
      const res = await fetch("/api/hello-manager/launch", { cache: "no-store" });
      const data = (await res.json()) as {
        url?: string;
        mode?: LaunchMode;
      };
      const url = data.url || "https://helloappbeta.vercel.app/login";
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      window.open("https://helloappbeta.vercel.app/login", "_blank", "noopener,noreferrer");
    } finally {
      setOpening(false);
    }
  }, [opening]);

  return (
    <button
      type="button"
      onClick={openHelloManager}
      disabled={opening}
      title="HelloManager 학원관리 — Google 연동 계정은 로그인 없이 대시보드로 이동(설계)"
      className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
    >
      {opening ? "연결 중…" : "📱 헬로매니저"}
    </button>
  );
}
