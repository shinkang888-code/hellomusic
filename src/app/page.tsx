import { sql, type Model } from "@/lib/db";
import { Nav } from "./components/nav";
import { HomeHero } from "@/components/marketing/HomeHero";
import { StatsStrip } from "@/components/marketing/StatsStrip";
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase";
import { ModelCatalogSection } from "@/components/marketing/ModelCatalogSection";
import { CtaSection } from "@/components/marketing/CtaSection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const dynamic = "force-dynamic";

async function getModels(): Promise<Model[]> {
  try {
    return (await sql`
      SELECT id, repo_id, category, name, downloads, likes, note
      FROM models
      ORDER BY downloads DESC
    `) as Model[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const models = await getModels();
  const categories = Array.from(new Set(models.map((m) => m.category)));

  const stats = [
    { label: "큐레이션 모델", value: `${models.length}` },
    { label: "카테고리", value: `${categories.length}` },
    { label: "HF 컬렉션", value: "184" },
    { label: "AI 직원", value: "217" },
  ];

  return (
    <main className="flex-1 bg-page text-main">
      <Nav active="home" />
      <HomeHero />
      <StatsStrip stats={stats} />
      <FeatureShowcase />
      <ModelCatalogSection models={models} />
      <CtaSection />
      <MarketingFooter />
    </main>
  );
}
