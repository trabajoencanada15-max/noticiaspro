import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getAllPublishedAuthors } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Autores",
  description: "El equipo editorial de NoticiasPro: quiénes escriben y firman las noticias del sitio.",
};

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default async function AuthorsIndexPage() {
  const authors = await getAllPublishedAuthors();
  const breadcrumbItems = [{ name: "Portada", href: "/" }, { name: "Autores" }];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 border-b border-border pb-6">
        <h1 className="font-serif text-h1 font-bold">Autores</h1>
        <p className="mt-2 max-w-2xl text-body-lg text-muted-foreground">
          El equipo editorial que firma el contenido publicado en NoticiasPro. Cada artículo lleva la firma de
          quien lo redactó — ver{" "}
          <Link href="/politica-editorial" className="text-accent-link hover:underline">
            nuestra política editorial
          </Link>{" "}
          para saber cómo se verifica y aprueba cada noticia antes de publicarse.
        </p>
      </header>

      {authors.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Todavía no hay autores con contenido publicado.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <li key={author.id}>
              <Link
                href={`/autor/${author.slug}`}
                className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/40"
              >
                <Avatar className="size-12">
                  {author.avatar?.url && <AvatarImage src={author.avatar.url} alt={author.name} />}
                  <AvatarFallback>{initials(author.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{author.name}</p>
                  {author.roleTitle && <p className="text-sm text-muted-foreground">{author.roleTitle}</p>}
                  <p className="mt-1 text-caption text-muted-foreground">
                    {author.articleCount} {author.articleCount === 1 ? "artículo publicado" : "artículos publicados"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
