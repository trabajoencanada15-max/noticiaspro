import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function pageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?pagina=${page}`;
}

export function Pagination({
  basePath,
  currentPage,
  totalPages,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Paginación" className="mt-10 flex items-center justify-between border-t border-border pt-6">
      <Button asChild variant="outline" size="sm" disabled={!hasPrev}>
        {hasPrev ? (
          <Link href={pageHref(basePath, currentPage - 1)}>
            <ChevronLeft className="size-4" /> Anterior
          </Link>
        ) : (
          <span>
            <ChevronLeft className="size-4" /> Anterior
          </span>
        )}
      </Button>
      <span className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}
      </span>
      <Button asChild variant="outline" size="sm" disabled={!hasNext}>
        {hasNext ? (
          <Link href={pageHref(basePath, currentPage + 1)}>
            Siguiente <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span>
            Siguiente <ChevronRight className="size-4" />
          </span>
        )}
      </Button>
    </nav>
  );
}
