"use client";

import { useEffect, useRef, useState } from "react";
import { type Department } from "./types";
import { deptRealAvatarUrl, resizeAvatarFile } from "./resize-avatar";

export function DeptProfileEditor({
  department,
  aiLeaderName,
  avatarVersion,
  onClose,
  onSaved,
}: {
  department: Department;
  aiLeaderName: string;
  avatarVersion?: number;
  onClose: () => void;
  onSaved: (patch: {
    real_member_name: string | null;
    has_real_avatar: boolean;
    avatarVersion: number;
  }) => void;
}) {
  const [name, setName] = useState(department.real_member_name ?? "");
  const [preview, setPreview] = useState<string | null>(
    department.has_real_avatar
      ? deptRealAvatarUrl(department.slug, avatarVersion)
      : null,
  );
  const [avatarB64, setAvatarB64] = useState<string | null | undefined>(
    undefined,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(department.real_member_name ?? "");
    setPreview(
      department.has_real_avatar
        ? deptRealAvatarUrl(department.slug, avatarVersion)
        : null,
    );
    setAvatarB64(undefined);
    setError("");
  }, [department, avatarVersion]);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const b64 = await resizeAvatarFile(file);
      setAvatarB64(b64);
      setPreview(`data:image/webp;base64,${b64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "이미지 처리 실패");
    }
    e.target.value = "";
  }

  function removePhoto() {
    setAvatarB64(null);
    setPreview(null);
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const payload: {
        name: string;
        avatar?: string | null;
        clearAvatar?: boolean;
      } = { name: name.trim() };

      if (avatarB64 === null) payload.clearAvatar = true;
      else if (avatarB64 !== undefined) payload.avatar = avatarB64;

      const res = await fetch(
        `/api/departments/${encodeURIComponent(department.slug)}/profile`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json()) as {
        error?: string;
        department?: {
          real_member_name: string | null;
          has_real_avatar: boolean;
        };
        avatarVersion?: number;
      };
      if (!res.ok) throw new Error(data.error ?? "저장 실패");

      onSaved({
        real_member_name:
          data.department?.real_member_name ?? (name.trim() || null),
        has_real_avatar: data.department?.has_real_avatar ?? false,
        avatarVersion: data.avatarVersion ?? Date.now(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border bg-card p-5 shadow-xl"
        style={{ borderColor: department.color }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold" style={{ color: department.color }}>
          {department.label} · 실무 담당 프로필
        </h3>
        <p className="mt-1 text-xs text-sub">
          AI 팀장 <span className="text-sub">{aiLeaderName}</span> 밑에 실무
          담당(강사·행정)을 등록합니다
          실제 직원 정보를 등록합니다.
        </p>

        <div className="mt-4 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative flex size-24 items-center justify-center overflow-hidden rounded-full bg-elevated ring-2 ring-slate-600 transition hover:ring-blue-400"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="프로필 미리보기"
                className="size-full object-cover"
              />
            ) : (
              <span className="text-3xl text-muted">👤</span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-black/50 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
              사진 변경
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={onFileChange}
          />
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-lg bg-elevated px-3 py-1.5 text-main ring-1 ring-theme hover:bg-elevated-hover"
            >
              📷 사진 업로드
            </button>
            {preview && (
              <button
                type="button"
                onClick={removePhoto}
                className="rounded-lg px-3 py-1.5 text-rose-300 ring-1 ring-rose-500/30 hover:bg-rose-500/10"
              >
                사진 제거
              </button>
            )}
          </div>
          <p className="text-[10px] text-muted">
            자동으로 128×128 WebP로 리사이즈됩니다.
          </p>
        </div>

        <label className="mt-4 block text-xs font-medium text-sub">
          실무 담당 이름
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 홍길동 (실제 직원)"
            maxLength={40}
            className="mt-1 w-full rounded-lg bg-page px-3 py-2 text-sm text-main ring-1 ring-theme outline-none focus:ring-blue-500"
          />
        </label>

        {error && (
          <p className="mt-2 text-xs text-rose-400">{error}</p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-50"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-elevated px-4 py-2 text-sm text-sub ring-1 ring-theme hover:bg-elevated-hover"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
