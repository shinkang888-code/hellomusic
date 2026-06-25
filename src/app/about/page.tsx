import { Nav } from "@/app/components/nav";
import { AboutHero } from "@/components/marketing/AboutHero";
import { AboutValues } from "@/components/marketing/AboutValues";
import { CtaSection } from "@/components/marketing/CtaSection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

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
