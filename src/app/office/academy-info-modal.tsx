"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: {
            client_id: string;
            callback: (res: { credential: string }) => void;
          }) => void;
          renderButton: (
            el: HTMLElement,
            cfg: { theme?: string; size?: string; text?: string; width?: number },
          ) => void;
        };
      };
    };
  }
}

type Props = {
  open: boolean;
  onClose: () => void;
};

type InfoState = {
  publicNotice: string;
  privateNotes?: string;
  blogUrl?: string | null;
  blogCacheAt?: string | null;
  isAdmin: boolean;
  email?: string;
};

export function AcademyInfoModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState<InfoState | null>(null);
  const [publicNotice, setPublicNotice] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [error, setError] = useState("");
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [infoRes, authRes] = await Promise.all([
        fetch("/api/academy-info", { cache: "no-store" }),
        fetch("/api/auth/google", { cache: "no-store" }),
      ]);
      const data = (await infoRes.json()) as InfoState & { error?: string };
      const auth = (await authRes.json()) as { admin?: boolean; email?: string };
      if (data.error) throw new Error(data.error);
      const merged = {
        ...data,
        isAdmin: auth.admin ?? data.isAdmin,
        email: auth.email,
      };
      setInfo(merged);
      setPublicNotice(merged.publicNotice || "");
      setPrivateNotes(merged.privateNotes || "");
      setBlogUrl(merged.blogUrl || "");
    } catch {
      setError("학원정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  useEffect(() => {
    if (!open || !info || info.isAdmin || !clientId) return;
    const t = setTimeout(() => {
      if (!googleBtnRef.current || !window.google) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (res) => {
          const r = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: res.credential }),
          });
          if (r.ok) load();
          else {
            const j = (await r.json()) as { error?: string };
            setError(j.error || "로그인 실패");
          }
        },
      });
      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "medium",
        text: "signin_with",
        width: 260,
      });
    }, 200);
    return () => clearTimeout(t);
  }, [open, info, clientId, load]);

  async function save(refreshBlog = false) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/academy-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicNotice,
          privateNotes,
          blogUrl: blogUrl.trim() || null,
          refreshBlog,
        }),
      });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(j.error || "저장 실패");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/google", { method: "DELETE" });
    await load();
  }

  if (!open) return null;

  const isAdmin = info?.isAdmin;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-[#9B2335]/20"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-[#9B2335] to-[#1e2a4a] px-5 py-4 text-white">
          <div>
            <h2 className="text-lg font-bold tracking-tight">📋 학원정보</h2>
            <p className="text-xs text-white/80">
              {isAdmin
                ? "원장 관리자 — 공지·비공개 메모·블로그 연동"
                : "공지되는 게시글 열람"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-lg transition hover:bg-white/15"
            aria-label="닫기"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="text-center text-sm text-slate-500">불러오는 중…</p>
          ) : isAdmin ? (
            <div className="space-y-4">
              {info?.email && (
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  <span>관리자: {info.email}</span>
                  <button
                    type="button"
                    onClick={logout}
                    className="font-semibold underline"
                  >
                    로그아웃
                  </button>
                </div>
              )}
              <Field
                label="공지되는 게시글 (비회원·학부모 공개)"
                hint="학원상담 AI와 공개 팝업에 표시됩니다."
                value={publicNotice}
                onChange={setPublicNotice}
                rows={6}
              />
              <Field
                label="원장 전용 추가 정보 (비공개)"
                hint="상담 AI만 참고합니다. 다른 사람에게는 보이지 않습니다."
                value={privateNotes}
                onChange={setPrivateNotes}
                rows={8}
              />
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  블로그 주소 (네이버 등)
                </label>
                <input
                  type="url"
                  value={blogUrl}
                  onChange={(e) => setBlogUrl(e.target.value)}
                  placeholder="https://blog.naver.com/hellomusic0104"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#9B2335] focus:ring-2 focus:ring-[#9B2335]/20"
                />
                {info?.blogCacheAt && (
                  <p className="mt-1 text-[10px] text-slate-500">
                    블로그 캐시: {new Date(info.blogCacheAt).toLocaleString("ko-KR")}
                  </p>
                )}
              </div>
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#9B2335]">
                  공지되는 게시글
                </h3>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">
                  {info?.publicNotice || "등록된 공지가 없습니다."}
                </pre>
              </div>
              {info?.blogUrl && (
                <a
                  href={info.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200"
                >
                  📝 블로그 바로가기
                </a>
              )}
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3">
                <p className="mb-2 text-xs text-slate-600">
                  원장님만 학원정보를 수정할 수 있습니다. Google 관리자 계정으로
                  로그인하세요.
                </p>
                {clientId ? (
                  <div ref={googleBtnRef} className="flex justify-center" />
                ) : (
                  <p className="text-center text-[11px] text-amber-700">
                    NEXT_PUBLIC_GOOGLE_CLIENT_ID 설정 필요
                  </p>
                )}
              </div>
              {error && (
                <p className="text-xs text-red-600">{error}</p>
              )}
            </div>
          )}
        </div>

        {isAdmin && !loading && (
          <footer className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => save(false)}
              className="rounded-xl bg-[#9B2335] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#7a1c2a] disabled:opacity-50"
            >
              {saving ? "저장 중…" : "저장"}
            </button>
            <button
              type="button"
              disabled={saving || !blogUrl.trim()}
              onClick={() => save(true)}
              className="rounded-xl bg-[#1e2a4a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d3f6b] disabled:opacity-50"
            >
              저장 + 블로그 새로고침
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  rows,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-slate-700">{label}</label>
      <p className="mb-1.5 text-[10px] text-slate-500">{hint}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm leading-relaxed text-slate-900 outline-none focus:border-[#9B2335] focus:ring-2 focus:ring-[#9B2335]/20"
      />
    </div>
  );
}
