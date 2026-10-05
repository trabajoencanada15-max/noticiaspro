"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/site/Logo";
import type { CategorySummary, RegionSummary } from "@/lib/types";

export function MobileNav({
  categories,
  regions,
}: {
  categories: CategorySummary[];
  regions: RegionSummary[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full gap-0 overflow-y-auto bg-background p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border">
          <SheetTitle asChild>
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <form action="/buscar" method="GET" className="flex gap-2 border-b border-border p-4">
          <input
            type="search"
            name="q"
            placeholder="Buscar en todo el sitio..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <Button type="submit" variant="outline" size="icon" aria-label="Buscar">
            <Search className="size-4" />
          </Button>
        </form>

        {regions.length > 0 && (
          <div className="border-b border-border p-4">
            <h2 className="text-overline uppercase tracking-[var(--text-overline--letter-spacing)] text-muted-foreground">
              Ediciones
            </h2>
            <ul className="mt-2 grid grid-cols-2 gap-1">
              {regions.map((region) => (
                <li key={region.id}>
                  <Link
                    href={`/region/${region.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    {region.flagEmoji && <span aria-hidden="true">{region.flagEmoji}</span>}
                    {region.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <nav aria-label="Secciones" className="p-4">
          <h2 className="text-overline uppercase tracking-[var(--text-overline--letter-spacing)] text-muted-foreground">
            Secciones
          </h2>
          <ul className="mt-2">
            <li>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-2.5 text-body-lg font-medium text-foreground hover:bg-muted"
              >
                Últimas noticias
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categoria/${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-body-lg font-medium text-foreground hover:bg-muted"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <h2 className="text-overline uppercase tracking-[var(--text-overline--letter-spacing)] text-muted-foreground">
            Más
          </h2>
          <ul className="mt-2">
            <li>
              <Link
                href="/trending"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium text-accent-link hover:bg-muted"
              >
                <TrendingUp className="size-4" />
                Tendencias
              </Link>
            </li>
            <li>
              <Link
                href="/autores"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Users className="size-4" />
                Autores
              </Link>
            </li>
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
