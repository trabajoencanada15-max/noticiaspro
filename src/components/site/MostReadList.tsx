import Link from "next/link";
import { formatRelativeTime } from "@/lib/format";
import type { ArticleSummary } from "@/lib/types";

export function MostReadList({ articles }: { articles: ArticleSummary[] }) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="most-read-heading" className="py-10">
      <div className="mb-5 border-b border-border pb-3">
        <h2 id="most-read-heading" className="font-serif text-h3 font-bold">
          Lo más leído
        </h2>
      </div>
      <ol className="flex flex-col divide-y divide-border">
        {articles.map((article, index) => (
          <li key={article.id} className="flex gap-4 py-3">
            <span aria-hidden="true" className="font-serif text-h2 font-bold text-muted-foreground/60">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Link href={`/articulo/${article.slug}`} className="group min-w-0">
              <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:underline">
                {article.title}
              </h3>
              <p className="mt-1 text-caption text-muted-foreground">
                {formatRelativeTime(article.publishedAt)}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
