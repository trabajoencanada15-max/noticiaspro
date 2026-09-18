import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPublishedDate, formatReadingTime } from "@/lib/format";
import type { ArticleDetail } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AuthorByline({ article }: { article: ArticleDetail }) {
  const { author } = article;

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        {author.avatar?.url && <AvatarImage src={author.avatar.url} alt={author.name} />}
        <AvatarFallback>{initials(author.name)}</AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <Link href={`/autor/${author.slug}`} className="font-semibold text-foreground hover:underline">
          {author.name}
        </Link>
        <p className="text-muted-foreground">
          {article.publishedAt ? `Publicado: ${formatPublishedDate(article.publishedAt)}` : "Sin publicar"}
          {article.lastUpdatedAt && article.lastUpdatedAt !== article.publishedAt && (
            <> · Actualizado: {formatPublishedDate(article.lastUpdatedAt)}</>
          )}
          {article.readingTime ? <> · {formatReadingTime(article.readingTime)}</> : null}
        </p>
      </div>
    </div>
  );
}
