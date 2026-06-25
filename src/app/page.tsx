import { Nav } from "./components/nav";
import { HomeHero } from "@/components/marketing/HomeHero";
import { StatsStrip } from "@/components/marketing/StatsStrip";
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase";
import { ProgramsSection } from "@/components/marketing/ProgramsSection";
import { CtaSection } from "@/components/marketing/CtaSection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { HOME_STATS } from "@/data/academy-content";

export default function Home() {
  return (
    <main className="flex-1 bg-page text-main">
      <Nav active="home" />
      <HomeHero />
      <StatsStrip stats={[...HOME_STATS]} />
      <FeatureShowcase />
      <ProgramsSection />
      <CtaSection />
      <MarketingFooter />
    </main>
  );
}
