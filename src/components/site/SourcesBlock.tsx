import type { SourceReference } from "@/lib/types";

export function SourcesBlock({ sources }: { sources: SourceReference[] }) {
  if (sources.length === 0) return null;

  return (
    <section aria-labelledby="sources-heading" className="rounded-lg border border-border bg-muted/40 p-4">
      <h2 id="sources-heading" className="text-sm font-semibold text-foreground">
        Fuentes consultadas
      </h2>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        {sources.map((ref, index) => {
          const label = ref.source?.name ?? ref.note ?? "Fuente";
          const url = ref.url ?? ref.source?.url;
          return (
            <li key={index}>
              {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {label}
                </a>
              ) : (
                label
              )}
              {ref.note && ref.source?.name && <span> — {ref.note}</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
