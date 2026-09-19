import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata: Metadata = {
  title: "Política editorial",
  description: "Cómo verificamos, editamos y publicamos las noticias en NoticiasPro.",
};

export default function EditorialPolicyPage() {
  const breadcrumbItems = [{ name: "Portada", href: "/" }, { name: "Política editorial" }];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 border-b border-border pb-6">
        <h1 className="font-serif text-h1 font-bold">Política editorial</h1>
        <p className="mt-2 max-w-2xl text-body-lg text-muted-foreground">
          Cómo se investiga, verifica, edita y publica cada noticia en NoticiasPro.
        </p>
      </header>

      <div className="prose-article mt-8 text-base leading-relaxed">
        <section>
          <h2 className="text-h3 font-serif font-semibold">Flujo de publicación</h2>
          <p>
            Ningún artículo llega al público directamente desde quien lo escribe. Un artículo pasa por los
            siguientes estados: borrador, en revisión, y solo entonces puede programarse o publicarse. Los cambios
            posteriores a un artículo publicado se marcan como &ldquo;actualizado&rdquo;, conservando siempre la
            fecha original de publicación junto a la fecha de la última modificación.
          </p>
          <p>
            Solo un editor o un administrador puede aprobar el paso de un artículo a un estado publicado; quien lo
            redacta no tiene permiso para autopublicar su propio trabajo. Esta separación de roles está impuesta
            por el propio sistema, no solo por norma interna.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Fuentes</h2>
          <p>
            Cada artículo registra internamente las fuentes consultadas — agencias, medios, fuentes oficiales o
            comunicados — y, cuando corresponde, las muestra públicamente en la sección &ldquo;Fuentes
            consultadas&rdquo; al final de la noticia, con enlace al origen cuando está disponible. Registramos
            también el estatus de licencia de cada fuente (licenciada, dominio público, uso legítimo con
            atribución, o pendiente de revisión) como control interno antes de publicar.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Correcciones</h2>
          <p>
            Cuando un artículo publicado contiene un error, se corrige y se añade un aviso visible de corrección
            en el propio artículo. La fecha de publicación original nunca se modifica; solo se actualiza la fecha
            de última edición. Ver el detalle completo en nuestra{" "}
            <Link href="/politica-de-correcciones" className="text-accent-link hover:underline">
              política de correcciones
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Uso de inteligencia artificial</h2>
          <p>
            En NoticiasPro, herramientas de inteligencia artificial pueden usarse como apoyo en tareas como
            investigación preliminar, clasificación de contenido o asistencia en la redacción. Ninguna herramienta
            de IA publica contenido de forma autónoma: todo artículo, sin excepción, requiere revisión y
            aprobación editorial humana antes de publicarse, siguiendo el mismo flujo descrito arriba. Si esta
            práctica cambia de forma sustancial, esta política se actualizará para reflejarlo.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Separación entre contenido editorial y publicidad</h2>
          <p>
            El contenido editorial de NoticiasPro no está a la venta ni sujeto a influencia de anunciantes. Todo
            contenido patrocinado o pagado, si lo hubiera, se etiquetará de forma clara y visible como tal, y
            nunca se presentará como una noticia producida por nuestro equipo editorial. Más detalle en nuestra
            página de{" "}
            <Link href="/publicidad" className="text-accent-link hover:underline">
              publicidad
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Conflictos de interés</h2>
          <p>
            NoticiasPro es un proyecto independiente, sin vínculos con partidos políticos, gobiernos o grupos
            empresariales que pudieran condicionar la cobertura. Si el equipo editorial tiene algún vínculo
            relevante con el tema de una noticia, se procura declararlo en el propio artículo.
          </p>
        </section>
      </div>
    </div>
  );
}
