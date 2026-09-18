import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-1 text-caption text-muted-foreground">
      {items.map((item, index) => (
        <span key={item.name} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="size-3" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground hover:underline">
              {item.name}
            </Link>
          ) : (
            <span aria-current="page">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
