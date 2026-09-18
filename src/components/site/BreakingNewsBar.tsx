import Link from "next/link";
import type { BreakingNewsState } from "@/lib/types";

export function BreakingNewsBar({ breaking }: { breaking: BreakingNewsState }) {
  if (!breaking.isActive || !breaking.slug) return null;

  return (
    <div className="bg-accent text-accent-foreground">
      <Link
        href={`/articulo/${breaking.slug}`}
        className="mx-auto flex max-w-[var(--content-max-width)] items-center gap-3 px-4 py-2 text-sm"
      >
        <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-overline font-bold uppercase tracking-[var(--text-overline--letter-spacing)] text-accent-link">
          Última hora
        </span>
        <span className="truncate font-medium">{breaking.headline}</span>
      </Link>
    </div>
  );
}
