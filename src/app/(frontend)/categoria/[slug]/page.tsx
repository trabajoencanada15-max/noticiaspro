import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Pagination } from "@/components/site/Pagination";
import { getCategoryWithArticles, getPublishedCategorySlugs } from "@/lib/queries";
import { breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

type Args = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pagina?: string }>;
};

function parsePage(pagina?: string) {
  const page = Number(pagina);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export async function generateStaticParams() {
  const slugs = await getPublishedCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  const { slug } = await params;
  const page = parsePage((await searchParams).pagina);
  const result = await getCategoryWithArticles(slug, page);
  if (!result) return {};

  const canonicalPath = page > 1 ? `/categoria/${slug}?pagina=${page}` : `/categoria/${slug}`;
  return {
    title: result.category.name,
    description: result.category.description || `Últimas noticias de ${result.category.name} en NoticiasPro.`,
    alternates: { canonical: `${SITE_URL}${canonicalPath}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Args) {
  const { slug } = await params;
  const page = parsePage((await searchParams).pagina);
  const result = await getCategoryWithArticles(slug, page);

  if (!result || page > result.totalPages) notFound();

  const { category, articles, totalPages } = result;
  const breadcrumbItems = [{ name: "Portada", href: "/" }, { name: category.name }];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(breadcrumbItems.map((i) => ({ name: i.name, url: `${SITE_URL}${i.href ?? ""}` }))),
          ),
        }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 border-b border-border pb-6">
        <h1 className="font-serif text-h1 font-bold">{category.name}</h1>
        {category.description && <p className="mt-2 max-w-2xl text-body-lg text-muted-foreground">{category.description}</p>}
      </header>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="grid" />
        ))}
      </div>

      <Pagination basePath={`/categoria/${slug}`} currentPage={page} totalPages={totalPages} />
    </div>
  );
}
