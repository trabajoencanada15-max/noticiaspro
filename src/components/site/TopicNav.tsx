import Link from "next/link";
import { TrendingUp } from "lucide-react";
import type { CategorySummary } from "@/lib/types";

export function TopicNav({ categories }: { categories: CategorySummary[] }) {
  return (
    <nav aria-label="Secciones" className="border-b border-border bg-background">
      <ul className="scroll-fade-x mx-auto flex max-w-[var(--content-max-width)] items-center gap-1 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <li key={category.id} className="shrink-0">
            <Link
              href={`/categoria/${category.slug}`}
              className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {category.name}
            </Link>
          </li>
        ))}
        <li className="shrink-0">
          <Link
            href="/trending"
            className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-accent-link transition-colors hover:bg-muted"
          >
            <TrendingUp className="size-3.5" />
            Tendencias
          </Link>
        </li>
      </ul>
    </nav>
  );
}
