import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Text-based wordmark standing in until the official logo/favicon files are
 * uploaded through Media — mirrors the approved brand style (red "Noticias" +
 * white-on-red "Pro" badge) without depending on an image asset.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-0.5 font-serif text-2xl font-bold", className)}
      aria-label="NoticiasPro — Portada"
    >
      <span className="text-accent-link">Noticias</span>
      <span className="bg-accent px-1.5 text-accent-foreground">Pro</span>
    </Link>
  );
}
