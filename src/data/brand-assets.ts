/** HELLO 로고 기반 브랜드 에셋 경로 */

export const BRAND_ASSETS = {
  logo: "/brand/hello-logo.png",
  logoMark: "/brand/hello-icon.png",
  ogImage: "/brand/og-kakao.png",
  heroHome: "/images/hero-home.png",
  heroAbout: "/images/about-hero.png",
  heroOffice: "/brand/hello-office-hero.png",
  featureCurriculum: "/images/feature-curriculum.png",
  featureOffice: "/images/feature-office.png",
  featureRecital: "/images/feature-recital.png",
} as const;

export const BRAND_THEME = {
  cream: "#FAF8F4",
  ivory: "#F5F0E8",
  stone: "#E5E2DC",
  charcoal: "#3D3D3D",
  charcoalSoft: "#5C5C5C",
  gold: "#C9A962",
  goldLight: "#E8D5A8",
  goldGlow: "rgba(201, 169, 98, 0.35)",
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lc-aca.vercel.app";
