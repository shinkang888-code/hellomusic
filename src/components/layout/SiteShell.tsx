import { NavActive } from "@/app/components/nav-active";
import { Footer } from "@/components/layout/Footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col bg-page text-main">
      <NavActive />
      {children}
      <Footer />
    </main>
  );
}
