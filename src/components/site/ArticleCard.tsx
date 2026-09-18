import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, formatReadingTime } from "@/lib/format";
import type { ArticleSummary } from "@/lib/types";

type ArticleCardVariant = "hero" | "secondary" | "grid" | "compact";

const PRIORITY_LABEL: Record<string, string> = {
  breaking: "Última hora",
  featured: "Destacada",
};

function PriorityBadge({ priority }: { priority: ArticleSummary["priority"] }) {
  const label = PRIORITY_LABEL[priority];
  if (!label) return null;
  return (
    <Badge variant={priority === "breaking" ? "destructive" : "secondary"} className="w-fit">
      {label}
    </Badge>
  );
}

// Rendered as a sibling of the card's main <Link>, never nested inside it —
// nested <a> tags are invalid HTML and break click behavior.
function CategoryLink({ category }: { category: ArticleSummary["category"] }) {
  return (
    <Link
      href={`/categoria/${category.slug}`}
      className="-m-2 inline-block p-2 text-overline uppercase tracking-[var(--text-overline--letter-spacing)] text-accent-link hover:underline"
    >
      {category.name}
    </Link>
  );
}

function ArticleMeta({ article }: { article: ArticleSummary }) {
  return (
    <p className="text-caption text-muted-foreground">
      {article.author.name} · {formatRelativeTime(article.publishedAt)}
      {article.readingTime ? ` · ${formatReadingTime(article.readingTime)}` : ""}
    </p>
  );
}

export function ArticleCard({
  article,
  variant = "grid",
}: {
  article: ArticleSummary;
  variant?: ArticleCardVariant;
}) {
  const href = `/articulo/${article.slug}`;

  if (variant === "hero") {
    return (
      <article className="group space-y-2">
        <Link href={href} className="block">
          <div className="relative aspect-16/9 overflow-hidden rounded-lg bg-muted">
            <Image
              src={article.featuredImage.url}
              alt={article.featuredImage.alt}
              fill
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </Link>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={article.priority} />
            <CategoryLink category={article.category} />
          </div>
          <Link href={href} className="block">
            <h2 className="text-balance font-serif text-h1 font-bold leading-tight text-foreground group-hover:underline">
              {article.title}
            </h2>
          </Link>
          {article.subtitle && (
            <p className="text-body-lg text-muted-foreground">{article.subtitle}</p>
          )}
          <ArticleMeta article={article} />
        </div>
      </article>
    );
  }

  if (variant === "secondary") {
    return (
      <article className="group flex gap-3">
        <Link href={href} className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-md bg-muted sm:w-28">
          <Image
            src={article.featuredImage.url}
            alt={article.featuredImage.alt}
            fill
            sizes="120px"
            className="object-cover"
          />
        </Link>
        <div className="min-w-0 space-y-1">
          <CategoryLink category={article.category} />
          <Link href={href}>
            <h3 className="text-h4 font-serif font-semibold leading-snug text-foreground group-hover:underline">
              {article.title}
            </h3>
          </Link>
          <ArticleMeta article={article} />
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article>
        <Link href={href} className="group flex items-start gap-3 py-2.5">
          <div className="min-w-0 space-y-1">
            <h4 className="text-sm font-medium leading-snug text-foreground group-hover:underline">
              {article.title}
            </h4>
            <p className="text-caption text-muted-foreground">{formatRelativeTime(article.publishedAt)}</p>
          </div>
        </Link>
      </article>
    );
  }

  // grid (default)
  return (
    <article className="group">
      <Link href={href} className="block">
        <div className="relative aspect-16/10 overflow-hidden rounded-lg bg-muted">
          <Image
            src={article.featuredImage.url}
            alt={article.featuredImage.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      </Link>
      <div className="mt-3 space-y-1.5">
        <CategoryLink category={article.category} />
        <Link href={href}>
          <h3 className="text-h4 font-serif font-semibold leading-snug text-foreground group-hover:underline">
            {article.title}
          </h3>
        </Link>
        <ArticleMeta article={article} />
      </div>
    </article>
  );
}
