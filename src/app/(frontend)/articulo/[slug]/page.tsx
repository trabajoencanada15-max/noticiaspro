import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { after } from "next/server";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { AuthorByline } from "@/components/site/AuthorByline";
import { TagList } from "@/components/site/TagList";
import { SourcesBlock } from "@/components/site/SourcesBlock";
import { CorrectionNotice } from "@/components/site/CorrectionNotice";
import { ShareButtons } from "@/components/site/ShareButtons";
import { SectionModule } from "@/components/site/SectionModule";
import {
  getAllPublishedSlugs,
  getArticleBySlug,
  getRelatedArticles,
  incrementViewCount,
} from "@/lib/queries";
import { breadcrumbJsonLd, newsArticleJsonLd, personJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

type Args = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const article = await getArticleBySlug(slug, { draft });
  if (!article) return {};

  const title = article.seo.metaTitle || article.title;
  const description = article.seo.metaDescription || article.excerpt;
  const ogImage = article.seo.ogImage?.url || article.featuredImage.url;
  const canonical = article.seo.canonicalUrl || `${SITE_URL}/articulo/${article.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: article.seo.ogTitle || title,
      description,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.lastUpdatedAt ?? undefined,
      authors: [article.author.name],
      images: [{ url: ogImage }],
    },
    twitter: {
      card: (article.seo.twitterCardType as "summary" | "summary_large_image") || "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({ params }: Args) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const article = await getArticleBySlug(slug, { draft });

  if (!article) notFound();

  if (!draft) {
    after(() => incrementViewCount(article.id));
  }

  const related = await getRelatedArticles(article.category.id, article.id, 4);

  const breadcrumbItems = [
    { name: "Portada", href: "/" },
    { name: article.category.name, href: `/categoria/${article.category.slug}` },
    { name: article.title },
  ];

  return (
    <article className="mx-auto max-w-[var(--prose-width)] px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd(article)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(breadcrumbItems.map((i) => ({ name: i.name, url: `${SITE_URL}${i.href ?? ""}` }))),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(article.author)) }}
      />

      {draft && (
        <div className="mb-4 rounded-md bg-warning-correction/20 px-3 py-2 text-sm text-warning-correction-foreground">
          Vista previa — este artículo aún no está publicado.
        </div>
      )}

      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 space-y-3">
        <div className="flex items-center gap-2">
          {article.priority === "breaking" && <Badge variant="destructive">Última hora</Badge>}
          <span className="text-overline uppercase tracking-[var(--text-overline--letter-spacing)] text-accent-link">
            {article.category.name}
          </span>
        </div>
        <h1 className="font-serif text-h1 font-bold leading-tight text-balance">{article.title}</h1>
        {article.subtitle && <p className="text-body-lg text-muted-foreground">{article.subtitle}</p>}
        <AuthorByline article={article} />
      </header>

      <div className="relative mt-6 aspect-16/9 overflow-hidden rounded-lg bg-muted">
        <Image
          src={article.featuredImage.url}
          alt={article.featuredImage.alt}
          fill
          priority
          sizes="(min-width: 1024px) 70ch, 100vw"
          className="object-cover"
        />
      </div>
      {(article.imageCaption || article.imageCredit) && (
        <figcaption className="mt-2 text-caption text-muted-foreground">
          {article.imageCaption}
          {article.imageCaption && article.imageCredit ? " — " : ""}
          {article.imageCredit}
        </figcaption>
      )}

      <CorrectionNotice correction={article.correction} />

      <div className="prose-article mt-6 text-base leading-relaxed">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <RichText data={article.body as any} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <TagList tags={article.tags} />
        <ShareButtons title={article.title} url={`${SITE_URL}/articulo/${article.slug}`} />
      </div>

      <div className="mt-6">
        <SourcesBlock sources={article.sourceReferences} />
      </div>

      {related.length > 0 && (
        <div className="mt-4 -mx-4 px-4">
          <SectionModule title="También te puede interesar" articles={related} />
        </div>
      )}
    </article>
  );
}
