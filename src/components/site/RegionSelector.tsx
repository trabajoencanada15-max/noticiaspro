import Link from "next/link";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RegionSummary } from "@/lib/types";

export function RegionSelector({ regions }: { regions: RegionSummary[] }) {
  if (regions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5" aria-label="Elegir edición regional">
          <Globe className="size-4" />
          <span className="hidden sm:inline">Ediciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Elige una edición regional</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {regions.map((region) => (
          <DropdownMenuItem key={region.id} asChild>
            <Link href={`/region/${region.slug}`}>
              {region.flagEmoji && <span aria-hidden="true">{region.flagEmoji}</span>}
              {region.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
