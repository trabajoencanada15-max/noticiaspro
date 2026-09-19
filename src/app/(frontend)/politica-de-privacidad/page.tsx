import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué datos recoge NoticiasPro, con qué fin, y qué derechos tienes sobre ellos.",
};

const LAST_UPDATED = "18 de septiembre de 2026";

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [{ name: "Portada", href: "/" }, { name: "Política de privacidad" }];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 border-b border-border pb-6">
        <h1 className="font-serif text-h1 font-bold">Política de privacidad</h1>
        <p className="mt-2 max-w-2xl text-body-lg text-muted-foreground">
          Última actualización: {LAST_UPDATED}
        </p>
      </header>

      <div className="prose-article mt-8 text-base leading-relaxed">
        <section>
          <p>
            Este documento describe con la mayor precisión posible qué datos maneja NoticiasPro hoy. Es un aviso
            informativo, no un dictamen legal; si tienes dudas específicas sobre tus derechos, te recomendamos
            asesoría legal independiente.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Quién trata tus datos</h2>
          <p>
            NoticiasPro es un proyecto editorial independiente que opera el sitio{" "}
            <strong>noticiaspro.com</strong>. Para consultas sobre privacidad, escribe a{" "}
            <a href="mailto:contacto@noticiaspro.com" className="text-accent-link hover:underline">
              contacto@noticiaspro.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Qué datos recogemos hoy</h2>
          <ul>
            <li>
              <strong>Infraestructura técnica.</strong> El sitio se aloja en Vercel, que procesa de forma
              automática datos técnicos de cada visita (dirección IP, tipo de navegador) como parte normal del
              funcionamiento de cualquier sitio web, con fines de entrega de contenido y seguridad.
            </li>
            <li>
              <strong>Preferencia de tema visual.</strong> Si eliges el modo oscuro o claro, esa preferencia se
              guarda únicamente en el almacenamiento local de tu navegador (<code>localStorage</code>). Nunca se
              envía a nuestros servidores ni se comparte con terceros.
            </li>
            <li>
              <strong>Correo de contacto.</strong> Si nos escribes a{" "}
              <a href="mailto:contacto@noticiaspro.com" className="text-accent-link hover:underline">
                contacto@noticiaspro.com
              </a>
              , recibimos la dirección de correo y el contenido de tu mensaje, que usamos únicamente para
              responderte.
            </li>
            <li>
              <strong>Contenido e imágenes del sitio.</strong> Los artículos, imágenes y datos editoriales se
              almacenan en una base de datos gestionada (Supabase) y en almacenamiento de archivos (Vercel Blob).
              Esta infraestructura no contiene datos personales de las personas que visitan el sitio.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Qué no hacemos todavía</h2>
          <p>
            Al día de hoy, NoticiasPro <strong>no utiliza cookies de analítica ni de publicidad</strong>, no tiene
            integrado un sistema de medición como Google Analytics, y no muestra anuncios de Google AdSense ni de
            ningún otro proveedor. Si en el futuro incorporamos alguna de estas herramientas, actualizaremos esta
            política antes de activarlas y, cuando corresponda, pediremos tu consentimiento a través de un aviso
            de cookies.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Con quién compartimos datos</h2>
          <p>
            No vendemos datos personales. Los únicos terceros que procesan datos técnicos en nuestro nombre son
            nuestros proveedores de infraestructura (Vercel para alojamiento y Supabase para base de datos), en su
            rol de encargados técnicos del servicio.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Tus derechos</h2>
          <p>
            Puedes solicitarnos en cualquier momento acceso, corrección o eliminación de cualquier dato que nos
            hayas proporcionado directamente (por ejemplo, por correo electrónico), escribiendo a{" "}
            <a href="mailto:contacto@noticiaspro.com" className="text-accent-link hover:underline">
              contacto@noticiaspro.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Cambios a esta política</h2>
          <p>
            Actualizaremos esta página cuando cambien nuestras prácticas de tratamiento de datos, incluyendo la
            fecha de última actualización al inicio del documento. Consulta también nuestra{" "}
            <Link href="/cookies" className="text-accent-link hover:underline">
              política de cookies
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
