import { Nav } from "../components/nav";
import { AboutHero } from "@/components/marketing/AboutHero";
import { AboutValues } from "@/components/marketing/AboutValues";
import { CtaSection } from "@/components/marketing/CtaSection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata = {
  title: "학원 소개 — Hello Music Academy",
  description:
    "헬로뮤직 피아노 전문 학원 소개. HelloManager AI 학원관리, 1층 Academy Floor Plan, 교육 철학.",
};

export default function AboutPage() {
  return (
    <main className="flex-1 bg-page text-main">
      <Nav active="about" />
      <AboutHero />
      <AboutValues />
      <CtaSection />
      <MarketingFooter />
    </main>
  );
}
