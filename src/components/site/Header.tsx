import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { RegionSelector } from "@/components/site/RegionSelector";
import { TopicNav } from "@/components/site/TopicNav";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import type { CategorySummary, RegionSummary } from "@/lib/types";

export function Header({
  categories,
  regions,
}: {
  categories: CategorySummary[];
  regions: RegionSummary[];
}) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-[var(--content-max-width)] items-center justify-between gap-4 px-4 py-3">
        <Logo />
        <div className="flex items-center gap-2">
          <RegionSelector regions={regions} />
          <Button asChild variant="ghost" size="icon">
            <Link href="/buscar" aria-label="Buscar">
              <Search className="size-4" />
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
      <TopicNav categories={categories} />
    </header>
  );
}
