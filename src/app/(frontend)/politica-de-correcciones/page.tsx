import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata: Metadata = {
  title: "Política de correcciones",
  description: "Cómo corregimos errores en artículos ya publicados en NoticiasPro.",
};

export default function CorrectionsPolicyPage() {
  const breadcrumbItems = [{ name: "Portada", href: "/" }, { name: "Política de correcciones" }];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 border-b border-border pb-6">
        <h1 className="font-serif text-h1 font-bold">Política de correcciones</h1>
        <p className="mt-2 max-w-2xl text-body-lg text-muted-foreground">
          Los errores ocurren. Lo que importa es cómo se corrigen y qué tan visibles son esas correcciones.
        </p>
      </header>

      <div className="prose-article mt-8 text-base leading-relaxed">
        <section>
          <h2 className="text-h3 font-serif font-semibold">Cómo funciona una corrección</h2>
          <p>
            Cuando identificamos un error en un artículo ya publicado — ya sea porque lo detecta el equipo
            editorial o porque un lector nos escribe — corregimos el texto y añadimos un aviso de corrección
            visible directamente en el artículo, con la fecha en que se hizo el cambio y, cuando aporta contexto,
            una nota explicando qué se corrigió.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Qué no cambia</h2>
          <p>
            La fecha original de publicación de un artículo nunca se modifica, incluso después de una corrección.
            Solo se actualiza la fecha de última edición. Esto permite distinguir siempre cuándo se publicó algo
            por primera vez y cuándo se corrigió.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Retractación y archivo</h2>
          <p>
            En casos donde un artículo completo resulta ser incorrecto de forma sustancial, se marca como
            retractado, dejando constancia de ello en lugar de eliminarlo silenciosamente. Los artículos que dejan
            de ser relevantes o vigentes pueden archivarse, sin borrarse del registro público.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Cómo reportar un error</h2>
          <p>
            Escríbenos a{" "}
            <a href="mailto:contacto@noticiaspro.com" className="text-accent-link hover:underline">
              contacto@noticiaspro.com
            </a>{" "}
            indicando el enlace del artículo y el error específico. Revisamos cada solicitud antes de publicar una
            corrección.
          </p>
        </section>
      </div>
    </div>
  );
}
