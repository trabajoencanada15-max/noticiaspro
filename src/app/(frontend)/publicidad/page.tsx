import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata: Metadata = {
  title: "Publicidad",
  description: "Cómo funciona (y funcionará) la publicidad en NoticiasPro.",
};

export default function AdvertisingPage() {
  const breadcrumbItems = [{ name: "Portada", href: "/" }, { name: "Publicidad" }];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 border-b border-border pb-6">
        <h1 className="font-serif text-h1 font-bold">Publicidad</h1>
        <p className="mt-2 max-w-2xl text-body-lg text-muted-foreground">
          Cómo pensamos financiar NoticiasPro sin comprometer la independencia editorial.
        </p>
      </header>

      <div className="prose-article mt-8 text-base leading-relaxed">
        <section>
          <h2 className="text-h3 font-serif font-semibold">Estado actual</h2>
          <p>
            Al día de hoy, NoticiasPro no muestra anuncios. Estamos en proceso de evaluar redes publicitarias como
            Google AdSense para financiar el mantenimiento del sitio.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Independencia editorial</h2>
          <p>
            Cuando se activen anuncios, estos se mostrarán claramente diferenciados del contenido editorial. Los
            anunciantes no tienen ni tendrán influencia sobre qué noticias cubrimos, cómo las cubrimos, ni sobre
            el trabajo de nuestro equipo editorial. Ver más en nuestra{" "}
            <Link href="/politica-editorial" className="text-accent-link hover:underline">
              política editorial
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Contenido patrocinado</h2>
          <p>
            Si en algún momento publicamos contenido patrocinado o pagado por un tercero, lo etiquetaremos de
            forma visible como tal (por ejemplo, &ldquo;Contenido patrocinado&rdquo;), y nunca se presentará como
            una noticia producida de forma independiente por nuestra redacción.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Cookies de publicidad</h2>
          <p>
            Cuando se activen anuncios que usen cookies de publicidad, se lo indicaremos con un aviso de
            consentimiento y actualizaremos nuestra{" "}
            <Link href="/cookies" className="text-accent-link hover:underline">
              política de cookies
            </Link>{" "}
            antes de activarlas.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Contacto comercial</h2>
          <p>
            Para consultas sobre publicidad o patrocinios, escribe a{" "}
            <a href="mailto:contacto@noticiaspro.com" className="text-accent-link hover:underline">
              contacto@noticiaspro.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
