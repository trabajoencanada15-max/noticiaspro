import Link from "next/link";
import { ArticleCard } from "@/components/site/ArticleCard";
import type { ArticleSummary } from "@/lib/types";

export function SectionModule({
  title,
  href,
  articles,
}: {
  title: string;
  href?: string;
  articles: ArticleSummary[];
}) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby={`section-${title}`} className="py-10">
      <div className="mb-5 flex items-baseline justify-between border-b border-border pb-3">
        <h2 id={`section-${title}`} className="font-serif text-h3 font-bold">
          {title}
        </h2>
        {href && (
          <Link href={href} className="text-sm font-medium text-accent-link hover:underline">
            Ver más
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="grid" />
        ))}
      </div>
    </section>
  );
}
