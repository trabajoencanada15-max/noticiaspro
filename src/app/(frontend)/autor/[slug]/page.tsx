import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Pagination } from "@/components/site/Pagination";
import { getAuthorWithArticles, getPublishedAuthorSlugs } from "@/lib/queries";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

type Args = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pagina?: string }>;
};

const PLATFORM_LABEL: Record<string, string> = {
  x: "X",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  web: "Sitio web",
};

function parsePage(pagina?: string) {
  const page = Number(pagina);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export async function generateStaticParams() {
  const slugs = await getPublishedAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  const { slug } = await params;
  const page = parsePage((await searchParams).pagina);
  const result = await getAuthorWithArticles(slug, page);
  if (!result) return {};

  const canonicalPath = page > 1 ? `/autor/${slug}?pagina=${page}` : `/autor/${slug}`;
  return {
    title: result.author.name,
    description: result.author.bio || `Artículos de ${result.author.name} en NoticiasPro.`,
    alternates: { canonical: `${SITE_URL}${canonicalPath}` },
  };
}

export default async function AuthorPage({ params, searchParams }: Args) {
  const { slug } = await params;
  const page = parsePage((await searchParams).pagina);
  const result = await getAuthorWithArticles(slug, page);

  if (!result || page > result.totalPages) notFound();

  const { author, articles, totalPages } = result;
  const breadcrumbItems = [{ name: "Portada", href: "/" }, { name: author.name }];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(author)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(breadcrumbItems.map((i) => ({ name: i.name, url: `${SITE_URL}${i.href ?? ""}` }))),
          ),
        }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 flex items-start gap-4 border-b border-border pb-6">
        <Avatar className="size-16">
          {author.avatar?.url && <AvatarImage src={author.avatar.url} alt={author.name} />}
          <AvatarFallback className="text-lg">{initials(author.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-serif text-h1 font-bold">{author.name}</h1>
          {author.roleTitle && <p className="text-muted-foreground">{author.roleTitle}</p>}
          {author.bio && <p className="mt-2 max-w-2xl text-body-lg text-muted-foreground">{author.bio}</p>}
          {author.socialLinks.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-3 text-sm">
              {author.socialLinks.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-accent-link hover:underline">
                    {PLATFORM_LABEL[link.platform] ?? link.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="grid" />
        ))}
      </div>

      <Pagination basePath={`/autor/${slug}`} currentPage={page} totalPages={totalPages} />
    </div>
  );
}
