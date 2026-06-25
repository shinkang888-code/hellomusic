import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 text-sm text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p>
          Lonex AI · The Logical Nexus of Infinite Data · Powered by Next.js +
          Neon + Vercel
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-slate-300">
            회사 소개
          </Link>
          <a
            href="https://lonex-ai.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-300"
          >
            AI 대시보드
          </a>
        </div>
      </div>
    </footer>
  );
}
