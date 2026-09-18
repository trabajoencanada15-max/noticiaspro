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

  return entries;
}
