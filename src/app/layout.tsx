import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { GlobalThemeToggle } from "./components/global-theme-toggle";
import { BRAND } from "@/data/academy-content";
import { BRAND_ASSETS, SITE_URL } from "@/data/brand-assets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = `${BRAND.name} — 헬로뮤직 피아노 전문 학원`;
const siteDescription =
  "HELLO · 헬로뮤직 피아노 학원. 1:1 레슨, 그랜드 스튜디오, AI 학원관리(HelloManager). Play. Learn. Grow.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: [{ url: BRAND_ASSETS.logoMark, type: "image/png" }],
    apple: [{ url: BRAND_ASSETS.logoMark, type: "image/png" }],
    shortcut: BRAND_ASSETS.logoMark,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: BRAND.name,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: BRAND_ASSETS.ogImage,
        width: 1200,
        height: 630,
        alt: "HELLO · Hello Music Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [BRAND_ASSETS.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('lonex-theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <GlobalThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
