import { ArticleCard } from "@/components/site/ArticleCard";
import type { ArticleSummary } from "@/lib/types";

export function Hero({
  lead,
  secondary,
}: {
  lead: ArticleSummary | null;
  secondary: ArticleSummary[];
}) {
  if (!lead) return null;

  return (
    <section aria-label="Historia principal" className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ArticleCard article={lead} variant="hero" />
      </div>
      {secondary.length > 0 && (
        <div className="flex flex-col gap-5 divide-y divide-border lg:border-l lg:border-border lg:pl-8">
          {secondary.map((article) => (
            <div key={article.id} className="pt-5 first:pt-0">
              <ArticleCard article={article} variant="secondary" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
