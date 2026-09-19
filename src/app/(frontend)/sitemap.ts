import type { MetadataRoute } from "next";
import {
  getPublishedAuthorSlugs,
  getPublishedCategorySlugs,
  getPublishedRegionSlugs,
  getSitemapArticles,
} from "@/lib/queries";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categorySlugs, regionSlugs, authorSlugs] = await Promise.all([
    getSitemapArticles(),
    getPublishedCategorySlugs(),
    getPublishedRegionSlugs(),
    getPublishedAuthorSlugs(),
  ]);

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "always", priority: 1 },
  ];

  for (const article of articles) {
    entries.push({
      url: `${SITE_URL}/articulo/${article.slug}`,
      lastModified: article.lastUpdatedAt || article.publishedAt || undefined,
      changeFrequency: "hourly",
      priority: 0.8,
    });
  }

  for (const slug of categorySlugs) {
    entries.push({
      url: `${SITE_URL}/categoria/${slug}`,
      changeFrequency: "hourly",
      priority: 0.6,
    });
  }

  for (const slug of regionSlugs) {
    entries.push({
      url: `${SITE_URL}/region/${slug}`,
      changeFrequency: "hourly",
      priority: 0.5,
    });
  }

  for (const slug of authorSlugs) {
    entries.push({
      url: `${SITE_URL}/autor/${slug}`,
      changeFrequency: "daily",
      priority: 0.4,
    });
  }

  entries.push({ url: `${SITE_URL}/autores`, changeFrequency: "weekly", priority: 0.4 });

  const legalPages = [
    "sobre-nosotros",
    "contacto",
    "politica-editorial",
    "politica-de-correcciones",
    "politica-de-privacidad",
    "cookies",
    "terminos-y-condiciones",
    "publicidad",
  ];
  for (const slug of legalPages) {
    entries.push({ url: `${SITE_URL}/${slug}`, changeFrequency: "yearly", priority: 0.2 });
  }

  return entries;
}
