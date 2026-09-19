import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Cómo ponerte en contacto con el equipo de NoticiasPro.",
};

const CONTACT_EMAIL = "contacto@noticiaspro.com";

export default function ContactPage() {
  const breadcrumbItems = [{ name: "Portada", href: "/" }, { name: "Contacto" }];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 border-b border-border pb-6">
        <h1 className="font-serif text-h1 font-bold">Contacto</h1>
        <p className="mt-2 max-w-2xl text-body-lg text-muted-foreground">
          Puedes escribirnos para cualquier consulta relacionada con nuestro contenido.
        </p>
      </header>

      <div className="prose-article mt-8 text-base leading-relaxed">
        <section>
          <h2 className="text-h3 font-serif font-semibold">Correo general</h2>
          <p>
            Para consultas generales, prensa, colaboraciones o publicidad, escríbenos a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-link hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Reportar un error o solicitar una corrección</h2>
          <p>
            Si encuentras un dato incorrecto en alguno de nuestros artículos, escríbenos al mismo correo indicando
            el enlace del artículo y el error específico. Revisamos cada solicitud siguiendo nuestra{" "}
            <a href="/politica-de-correcciones" className="text-accent-link hover:underline">
              política de correcciones
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Otros canales</h2>
          <p>
            Por el momento no publicamos un teléfono ni una dirección física de atención al público; el correo
            electrónico es nuestro canal oficial de contacto.
          </p>
        </section>
      </div>
    </div>
  );
}
