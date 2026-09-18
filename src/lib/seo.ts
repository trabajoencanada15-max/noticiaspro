import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { ArticleDetail } from "@/lib/types";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/buscar?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function personJsonLd(author: { name: string; slug: string; avatar?: { url: string } | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${SITE_URL}/autor/${author.slug}`,
    ...(author.avatar ? { image: author.avatar.url } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function newsArticleJsonLd(article: ArticleDetail) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.featuredImage.url],
    datePublished: article.publishedAt,
    dateModified: article.lastUpdatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `${SITE_URL}/autor/${article.author.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articulo/${article.slug}`,
    },
    articleSection: article.category.name,
    keywords: article.tags.map((t) => t.name).join(", ") || undefined,
  };
}
