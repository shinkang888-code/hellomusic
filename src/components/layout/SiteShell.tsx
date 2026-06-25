import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col bg-page text-main">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
