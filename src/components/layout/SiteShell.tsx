import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col bg-slate-950 text-slate-100">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
