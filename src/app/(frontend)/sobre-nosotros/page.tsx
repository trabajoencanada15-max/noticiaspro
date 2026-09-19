import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description: "Qué es NoticiasPro, cómo trabajamos y quién forma parte del equipo editorial.",
};

export default function AboutPage() {
  const breadcrumbItems = [{ name: "Portada", href: "/" }, { name: "Sobre nosotros" }];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 border-b border-border pb-6">
        <h1 className="font-serif text-h1 font-bold">Sobre nosotros</h1>
        <p className="mt-2 max-w-2xl text-body-lg text-muted-foreground">
          NoticiasPro es un medio digital en español que cubre actualidad internacional, política, economía,
          sociedad, tecnología, ciencia, cultura y deportes, con ediciones regionales para República Dominicana,
          Centroamérica, Estados Unidos, México, Colombia, Argentina y España.
        </p>
      </header>

      <div className="prose-article mt-8 text-base leading-relaxed">
        <section>
          <h2 className="text-h3 font-serif font-semibold">Qué hacemos</h2>
          <p>
            Publicamos noticias organizadas por tema y por región, con el objetivo de ofrecer cobertura clara,
            verificada y con la fuente de cada dato identificada. NoticiasPro es un proyecto independiente: no
            pertenece a ningún partido político, gobierno ni grupo empresarial, y no recibe financiamiento de
            ninguna de las fuentes que cubre.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Cómo trabaja el equipo</h2>
          <p>
            Cada artículo pasa por un flujo editorial con roles diferenciados antes de llegar al público:
          </p>
          <ul>
            <li>
              <strong>Autores</strong> — redactan e investigan los artículos, pero no pueden publicarlos por
              sí mismos.
            </li>
            <li>
              <strong>Editores</strong> — revisan, corrigen y aprueban el contenido antes de que salga al aire,
              y son los únicos, junto a los administradores, que pueden cambiar el estado de un artículo a
              publicado.
            </li>
            <li>
              <strong>Verificadores de datos (fact-checkers)</strong> — revisan afirmaciones y fuentes citadas.
            </li>
            <li>
              <strong>Responsables de SEO</strong> — cuidan que el contenido sea encontrable y esté bien
              estructurado, sin alterar el fondo editorial.
            </li>
          </ul>
          <p>
            Este flujo está impuesto a nivel de sistema, no solo como norma interna: un autor no tiene permiso
            técnico para marcar su propio artículo como publicado. Más detalle en nuestra{" "}
            <Link href="/politica-editorial" className="text-accent-link hover:underline">
              política editorial
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Quién firma el contenido</h2>
          <p>
            Todo artículo publicado lleva el nombre de la persona autora. Puedes ver el listado completo de
            quienes escriben en NoticiasPro en nuestra página de{" "}
            <Link href="/autores" className="text-accent-link hover:underline">
              autores
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Contacto</h2>
          <p>
            Para consultas de prensa, correcciones o cualquier otro tema, visita nuestra página de{" "}
            <Link href="/contacto" className="text-accent-link hover:underline">
              contacto
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
