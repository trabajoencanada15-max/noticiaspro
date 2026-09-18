import type { Metadata } from "next";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getMostRead } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Tendencias",
  description: "Las noticias más leídas en NoticiasPro.",
};

export default async function TrendingPage() {
  const articles = await getMostRead(20);
  const breadcrumbItems = [{ name: "Portada", href: "/" }, { name: "Tendencias" }];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 border-b border-border pb-6">
        <h1 className="font-serif text-h1 font-bold">Tendencias</h1>
        <p className="mt-2 max-w-2xl text-body-lg text-muted-foreground">
          Lo más leído en NoticiasPro en este momento.
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Todavía no hay suficientes lecturas para mostrar tendencias.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
