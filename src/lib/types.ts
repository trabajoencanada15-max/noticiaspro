/**
 * Hand-written types mirroring the fields our UI actually reads from Payload.
 * TODO: replace with generated `payload-types.ts` (`payload generate:types`)
 * once that CLI command runs cleanly under this project's Node version.
 */

export type MediaSummary = {
  id: number;
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
};

export type CategorySummary = {
  id: number;
  name: string;
  slug: string;
  accentColor?: string | null;
};

export type CategoryProfile = CategorySummary & {
  description?: string | null;
};

export type RegionSummary = {
  id: number;
  name: string;
  slug: string;
  flagEmoji?: string | null;
};

export type AuthorSummary = {
  id: number;
  name: string;
  slug: string;
  avatar?: MediaSummary | null;
};

export type ArticlePriority = "breaking" | "featured" | "standard";

export type ArticleSummary = {
  id: number;
  title: string;
  slug: string;
  subtitle?: string | null;
  excerpt: string;
  priority: ArticlePriority;
  publishedAt: string | null;
  lastUpdatedAt: string | null;
  readingTime: number | null;
  featuredImage: MediaSummary;
  category: CategorySummary;
  region?: RegionSummary | null;
  author: AuthorSummary;
};

export type BreakingNewsState = {
  isActive: boolean;
  headline: string;
  slug: string | null;
};

export type TagSummary = {
  id: number;
  name: string;
  slug: string;
};

export type SourceReference = {
  source?: { id: number; name: string; url?: string | null } | null;
  note?: string | null;
  url?: string | null;
};

export type SocialLink = {
  platform: string;
  url: string;
};

export type AuthorProfile = {
  id: number;
  name: string;
  slug: string;
  bio?: string | null;
  roleTitle?: string | null;
  avatar?: MediaSummary | null;
  socialLinks: SocialLink[];
};

export type PaginatedArticles = {
  articles: ArticleSummary[];
  totalDocs: number;
  totalPages: number;
  page: number;
};

export type ArticleDetail = ArticleSummary & {
  imageCaption?: string | null;
  imageCredit?: string | null;
  tags: TagSummary[];
  sourceReferences: SourceReference[];
  correction: {
    hasCorrection: boolean;
    correctionNote?: string | null;
    correctedAt?: string | null;
  };
  /** Lexical editor state JSON — render via <RichText data={body} /> */
  body: unknown;
  seo: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    canonicalUrl?: string | null;
    ogTitle?: string | null;
    ogImage?: MediaSummary | null;
    twitterCardType?: string | null;
  };
};
