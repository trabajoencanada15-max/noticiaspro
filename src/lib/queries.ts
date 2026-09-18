import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload";
import type {
  ArticleDetail,
  ArticleSummary,
  AuthorProfile,
  BreakingNewsState,
  CategoryProfile,
  CategorySummary,
  PaginatedArticles,
  RegionSummary,
} from "@/lib/types";

const PAGE_SIZE = 12;

/* eslint-disable @typescript-eslint/no-explicit-any */

function toArticleSummary(doc: any): ArticleSummary {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    subtitle: doc.subtitle ?? null,
    excerpt: doc.excerpt,
    priority: doc.priority,
    publishedAt: doc.publishedAt,
    lastUpdatedAt: doc.lastUpdatedAt,
    readingTime: doc.readingTime,
    featuredImage: {
      id: doc.featuredImage.id,
      url: doc.featuredImage.url,
      alt: doc.featuredImage.alt,
      width: doc.featuredImage.width,
      height: doc.featuredImage.height,
    },
    category: {
      id: doc.category.id,
      name: doc.category.name,
      slug: doc.category.slug,
      accentColor: doc.category.accentColor,
    },
    region: doc.region
      ? {
          id: doc.region.id,
          name: doc.region.name,
          slug: doc.region.slug,
          flagEmoji: doc.region.flagEmoji,
        }
      : null,
    author: {
      id: doc.author.id,
      name: doc.author.name,
      slug: doc.author.slug,
      avatar: doc.author.avatar ?? null,
    },
  };
}

// NOTE: Payload's Local API skips access control by default — `overrideAccess: false`
// is required on every one of these public-facing reads so drafts/in_review articles
// never leak onto the public site (there's no logged-in user here, so this evaluates
// the same anonymous branch as `publishedOnly` does over REST).

export const getBreakingNews = unstable_cache(
  async (): Promise<BreakingNewsState> => {
    const payload = await getPayloadClient();
    const global = await payload.findGlobal({
      slug: "breaking-news",
      depth: 1,
      overrideAccess: false,
    });

    const article = global.article as any;
    const inactive = !global.isActive || !article;
    const expired = global.expiresAt ? new Date(global.expiresAt) < new Date() : false;
    if (inactive || expired) {
      return { isActive: false, headline: "", slug: null };
    }

    return {
      isActive: true,
      headline: global.customText || article.title,
      slug: article.slug,
    };
  },
  ["breaking-news"],
  { tags: ["breaking-news"], revalidate: 300 },
);

export const getNavCategories = unstable_cache(
  async (): Promise<CategorySummary[]> => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "categories",
      where: { showInNav: { equals: true } },
      sort: "order",
      limit: 20,
      depth: 0,
      overrideAccess: false,
    });
    return res.docs.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      accentColor: c.accentColor,
    }));
  },
  ["nav-categories"],
  { tags: ["categories"], revalidate: 300 },
);

export const getHeroArticles = unstable_cache(
  async (): Promise<{ lead: ArticleSummary | null; secondary: ArticleSummary[] }> => {
    const payload = await getPayloadClient();
    // Fetch a wider recency window than we need so a breaking/featured article
    // doesn't get excluded from priority re-ranking just for being a few
    // articles older than the strict top-5-by-publishedAt cutoff.
    const res = await payload.find({
      collection: "articles",
      where: { status: { in: ["published", "updated"] } },
      sort: "-publishedAt",
      limit: 20,
      depth: 1,
      overrideAccess: false,
    });

    const priorityRank = (p: string) => (p === "breaking" ? 0 : p === "featured" ? 1 : 2);
    const sorted = [...res.docs].sort((a: any, b: any) => priorityRank(a.priority) - priorityRank(b.priority));
    const [lead, ...rest] = sorted.map(toArticleSummary);

    return { lead: lead ?? null, secondary: rest.slice(0, 4) };
  },
  ["hero-articles"],
  { tags: ["articles"], revalidate: 300 },
);

export const getCategoryModule = unstable_cache(
  async (
    categorySlug: string,
    limit = 4,
  ): Promise<{ category: CategorySummary; articles: ArticleSummary[] } | null> => {
    const payload = await getPayloadClient();
    const catRes = await payload.find({
      collection: "categories",
      where: { slug: { equals: categorySlug } },
      limit: 1,
      depth: 0,
      overrideAccess: false,
    });
    const category = catRes.docs[0] as any;
    if (!category) return null;

    const res = await payload.find({
      collection: "articles",
      where: {
        status: { in: ["published", "updated"] },
        category: { equals: category.id },
      },
      sort: "-publishedAt",
      limit,
      depth: 1,
      overrideAccess: false,
    });
    if (res.docs.length === 0) return null;

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        accentColor: category.accentColor,
      },
      articles: res.docs.map(toArticleSummary),
    };
  },
  ["category-module"],
  { tags: ["articles", "categories"], revalidate: 300 },
);

function toArticleDetail(doc: any): ArticleDetail {
  return {
    ...toArticleSummary(doc),
    imageCaption: doc.imageCaption ?? null,
    imageCredit: doc.imageCredit ?? null,
    tags: (doc.tags ?? []).map((t: any) => ({ id: t.id, name: t.name, slug: t.slug })),
    sourceReferences: (doc.sourceReferences ?? []).map((s: any) => ({
      source: s.source ? { id: s.source.id, name: s.source.name, url: s.source.url } : null,
      note: s.note ?? null,
      url: s.url ?? null,
    })),
    correction: {
      hasCorrection: Boolean(doc.correction?.hasCorrection),
      correctionNote: doc.correction?.correctionNote ?? null,
      correctedAt: doc.correction?.correctedAt ?? null,
    },
    body: doc.body,
    seo: {
      metaTitle: doc.seo?.metaTitle ?? null,
      metaDescription: doc.seo?.metaDescription ?? null,
      canonicalUrl: doc.seo?.canonicalUrl ?? null,
      ogTitle: doc.seo?.ogTitle ?? null,
      ogImage: doc.seo?.ogImage ?? null,
      twitterCardType: doc.seo?.twitterCardType ?? null,
    },
  };
}

const getPublishedArticleBySlug = unstable_cache(
  async (slug: string): Promise<ArticleDetail | null> => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "articles",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
      overrideAccess: false,
    });
    return res.docs[0] ? toArticleDetail(res.docs[0]) : null;
  },
  ["article-by-slug"],
  { tags: ["articles"], revalidate: 300 },
);

/** In draft mode (preview links), bypass the cache and access control entirely — the
 * preview route already validated the secret, and staff need to see the latest edit. */
export async function getArticleBySlug(
  slug: string,
  { draft = false }: { draft?: boolean } = {},
): Promise<ArticleDetail | null> {
  if (!draft) return getPublishedArticleBySlug(slug);

  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "articles",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    overrideAccess: true,
  });
  return res.docs[0] ? toArticleDetail(res.docs[0]) : null;
}

export const getAllPublishedSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "articles",
      where: { status: { in: ["published", "updated"] } },
      limit: 1000,
      depth: 0,
      overrideAccess: false,
      select: { slug: true },
    });
    return res.docs.map((d: any) => d.slug);
  },
  ["all-published-slugs"],
  { tags: ["articles"], revalidate: 300 },
);

export const getRelatedArticles = unstable_cache(
  async (categoryId: number, excludeId: number, limit = 4): Promise<ArticleSummary[]> => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "articles",
      where: {
        status: { in: ["published", "updated"] },
        category: { equals: categoryId },
        id: { not_equals: excludeId },
      },
      sort: "-publishedAt",
      limit,
      depth: 1,
      overrideAccess: false,
    });
    return res.docs.map(toArticleSummary);
  },
  ["related-articles"],
  { tags: ["articles"], revalidate: 300 },
);

/** Fire-and-forget view counter — bumps `viewCount` without triggering a full
 * `articles` tag revalidation cascade on every single page view. */
export async function incrementViewCount(articleId: number): Promise<void> {
  const payload = await getPayloadClient();
  const current = await payload.findByID({
    collection: "articles",
    id: articleId,
    depth: 0,
    overrideAccess: true,
  });
  await payload.update({
    collection: "articles",
    id: articleId,
    overrideAccess: true,
    context: { disableRevalidate: true, skipTrackUpdate: true },
    data: { viewCount: (current.viewCount ?? 0) + 1 },
  });
}

/** Minimal stub search — plain ILIKE-equivalent match on title/excerpt, no ranking. */
export async function searchArticles(query: string, limit = 20): Promise<ArticleSummary[]> {
  if (!query.trim()) return [];
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "articles",
    where: {
      status: { in: ["published", "updated"] },
      or: [{ title: { contains: query } }, { excerpt: { contains: query } }],
    },
    sort: "-publishedAt",
    limit,
    depth: 1,
    overrideAccess: false,
  });
  return res.docs.map(toArticleSummary);
}

export const getMostRead = unstable_cache(
  async (limit = 5): Promise<ArticleSummary[]> => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "articles",
      where: { status: { in: ["published", "updated"] } },
      sort: "-viewCount",
      limit,
      depth: 1,
      overrideAccess: false,
    });
    return res.docs.map(toArticleSummary);
  },
  ["most-read"],
  { tags: ["articles"], revalidate: 300 },
);

/** Only categories with at least one published article get a static page — no empty programmatic pages. */
export const getSitemapArticles = unstable_cache(
  async (): Promise<{ slug: string; publishedAt: string | null; lastUpdatedAt: string | null }[]> => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "articles",
      where: { status: { in: ["published", "updated"] } },
      sort: "-publishedAt",
      limit: 1000,
      depth: 0,
      overrideAccess: false,
    });
    return res.docs.map((d: any) => ({
      slug: d.slug,
      publishedAt: d.publishedAt,
      lastUpdatedAt: d.lastUpdatedAt,
    }));
  },
  ["sitemap-articles"],
  { tags: ["articles"], revalidate: 300 },
);

export const getPublishedCategorySlugs = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "articles",
      where: { status: { in: ["published", "updated"] } },
      limit: 1000,
      depth: 1,
      overrideAccess: false,
    });
    const slugs = new Set<string>();
    for (const doc of res.docs as any[]) {
      if (doc.category?.slug) slugs.add(doc.category.slug);
    }
    return [...slugs];
  },
  ["published-category-slugs"],
  { tags: ["articles"], revalidate: 300 },
);

export const getPublishedAuthorSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "articles",
      where: { status: { in: ["published", "updated"] } },
      limit: 1000,
      depth: 1,
      overrideAccess: false,
    });
    const slugs = new Set<string>();
    for (const doc of res.docs as any[]) {
      if (doc.author?.slug) slugs.add(doc.author.slug);
    }
    return [...slugs];
  },
  ["published-author-slugs"],
  { tags: ["articles"], revalidate: 300 },
);

export const getCategoryWithArticles = unstable_cache(
  async (
    categorySlug: string,
    page: number,
  ): Promise<{ category: CategoryProfile } & PaginatedArticles | null> => {
    const payload = await getPayloadClient();
    const catRes = await payload.find({
      collection: "categories",
      where: { slug: { equals: categorySlug } },
      limit: 1,
      depth: 0,
      overrideAccess: false,
    });
    const category = catRes.docs[0] as any;
    if (!category) return null;

    const res = await payload.find({
      collection: "articles",
      where: {
        status: { in: ["published", "updated"] },
        category: { equals: category.id },
      },
      sort: "-publishedAt",
      page,
      limit: PAGE_SIZE,
      depth: 1,
      overrideAccess: false,
    });
    if (res.totalDocs === 0) return null;

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? null,
        accentColor: category.accentColor,
      },
      articles: res.docs.map(toArticleSummary),
      totalDocs: res.totalDocs,
      totalPages: res.totalPages,
      page: res.page ?? page,
    };
  },
  ["category-with-articles"],
  { tags: ["articles", "categories"], revalidate: 300 },
);

export const getNavRegions = unstable_cache(
  async (): Promise<RegionSummary[]> => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "regions",
      where: { showInSelector: { equals: true } },
      sort: "order",
      limit: 20,
      depth: 0,
      overrideAccess: false,
    });
    return res.docs.map((r: any) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      flagEmoji: r.flagEmoji,
    }));
  },
  ["nav-regions"],
  { tags: ["regions"], revalidate: 300 },
);

/** Only regions with at least one published article get a static page — no empty programmatic pages. */
export const getPublishedRegionSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "articles",
      where: { status: { in: ["published", "updated"] } },
      limit: 1000,
      depth: 1,
      overrideAccess: false,
    });
    const slugs = new Set<string>();
    for (const doc of res.docs as any[]) {
      if (doc.region?.slug) slugs.add(doc.region.slug);
    }
    return [...slugs];
  },
  ["published-region-slugs"],
  { tags: ["articles"], revalidate: 300 },
);

export const getRegionWithArticles = unstable_cache(
  async (
    regionSlug: string,
    page: number,
  ): Promise<{ region: RegionSummary } & PaginatedArticles | null> => {
    const payload = await getPayloadClient();
    const regionRes = await payload.find({
      collection: "regions",
      where: { slug: { equals: regionSlug } },
      limit: 1,
      depth: 0,
      overrideAccess: false,
    });
    const region = regionRes.docs[0] as any;
    if (!region) return null;

    const res = await payload.find({
      collection: "articles",
      where: {
        status: { in: ["published", "updated"] },
        region: { equals: region.id },
      },
      sort: "-publishedAt",
      page,
      limit: PAGE_SIZE,
      depth: 1,
      overrideAccess: false,
    });
    if (res.totalDocs === 0) return null;

    return {
      region: {
        id: region.id,
        name: region.name,
        slug: region.slug,
        flagEmoji: region.flagEmoji,
      },
      articles: res.docs.map(toArticleSummary),
      totalDocs: res.totalDocs,
      totalPages: res.totalPages,
      page: res.page ?? page,
    };
  },
  ["region-with-articles"],
  { tags: ["articles", "regions"], revalidate: 300 },
);

export const getAuthorWithArticles = unstable_cache(
  async (
    authorSlug: string,
    page: number,
  ): Promise<{ author: AuthorProfile } & PaginatedArticles | null> => {
    const payload = await getPayloadClient();
    const authorRes = await payload.find({
      collection: "authors",
      where: { slug: { equals: authorSlug } },
      limit: 1,
      depth: 1,
      overrideAccess: false,
    });
    const author = authorRes.docs[0] as any;
    if (!author) return null;

    const res = await payload.find({
      collection: "articles",
      where: {
        status: { in: ["published", "updated"] },
        author: { equals: author.id },
      },
      sort: "-publishedAt",
      page,
      limit: PAGE_SIZE,
      depth: 1,
      overrideAccess: false,
    });
    if (res.totalDocs === 0) return null;

    return {
      author: {
        id: author.id,
        name: author.name,
        slug: author.slug,
        bio: author.bio ?? null,
        roleTitle: author.roleTitle ?? null,
        avatar: author.avatar ?? null,
        socialLinks: (author.socialLinks ?? []).map((s: any) => ({ platform: s.platform, url: s.url })),
      },
      articles: res.docs.map(toArticleSummary),
      totalDocs: res.totalDocs,
      totalPages: res.totalPages,
      page: res.page ?? page,
    };
  },
  ["author-with-articles"],
  { tags: ["articles"], revalidate: 300 },
);
