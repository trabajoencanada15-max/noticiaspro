import type { Metadata } from "next";
import { ArticleCard } from "@/components/site/ArticleCard";
import { searchArticles } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Buscar",
  robots: { index: false, follow: true },
};

type Args = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Args) {
  const q = ((await searchParams).q ?? "").trim();
  const results = q ? await searchArticles(q) : [];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <h1 className="font-serif text-h1 font-bold">Buscar</h1>

      <form method="GET" className="mt-6 flex max-w-lg gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar noticias..."
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Buscar
        </button>
      </form>

      {q && (
        <p className="mt-6 text-sm text-muted-foreground">
          {results.length > 0
            ? `${results.length} resultado(s) para "${q}"`
            : `Sin resultados para "${q}"`}
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
