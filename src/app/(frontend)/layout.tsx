import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/site/Header";
import { BreakingNewsBar } from "@/components/site/BreakingNewsBar";
import { Footer } from "@/components/site/Footer";
import { getBreakingNews, getNavCategories, getNavRegions } from "@/lib/queries";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

// Runs before hydration so the correct theme applies with no flash of the wrong one.
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, regions, breaking] = await Promise.all([
    getNavCategories(),
    getNavRegions(),
    getBreakingNews(),
  ]);

  return (
    <html lang="es" className={`${inter.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <BreakingNewsBar breaking={breaking} />
        <Header categories={categories} regions={regions} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
