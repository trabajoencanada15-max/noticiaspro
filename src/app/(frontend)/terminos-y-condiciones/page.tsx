import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de uso del sitio NoticiasPro.",
};

const LAST_UPDATED = "18 de septiembre de 2026";

export default function TermsPage() {
  const breadcrumbItems = [{ name: "Portada", href: "/" }, { name: "Términos y condiciones" }];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 border-b border-border pb-6">
        <h1 className="font-serif text-h1 font-bold">Términos y condiciones</h1>
        <p className="mt-2 max-w-2xl text-body-lg text-muted-foreground">
          Última actualización: {LAST_UPDATED}
        </p>
      </header>

      <div className="prose-article mt-8 text-base leading-relaxed">
        <section>
          <p>
            Este documento describe las condiciones bajo las que puedes usar noticiaspro.com. Es un aviso
            informativo redactado para un proyecto editorial independiente y no sustituye asesoría legal
            profesional.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Uso del sitio</h2>
          <p>
            NoticiasPro.com está disponible para uso personal e informativo. Al usar el sitio, aceptas no
            emplearlo para fines ilícitos, no intentar vulnerar su seguridad, y no reproducir de forma masiva o
            automatizada su contenido sin autorización.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Propiedad intelectual</h2>
          <p>
            Los artículos, textos, imágenes y demás contenido publicado en NoticiasPro son propiedad de
            NoticiasPro o de las personas y entidades que se indican como fuente en cada caso. Puedes citar
            fragmentos y compartir enlaces a nuestros artículos con atribución clara; la reproducción íntegra de
            artículos sin autorización no está permitida.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Contenido y enlaces externos</h2>
          <p>
            Nuestros artículos pueden enlazar a fuentes o sitios de terceros. No somos responsables del contenido
            ni de las prácticas de privacidad de sitios externos a los que enlazamos.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Límite de responsabilidad</h2>
          <p>
            Nos esforzamos por verificar la información que publicamos siguiendo nuestra{" "}
            <a href="/politica-editorial" className="text-accent-link hover:underline">
              política editorial
            </a>
            , pero el contenido se ofrece &ldquo;tal cual&rdquo; y con fines informativos. NoticiasPro no garantiza
            que el contenido esté libre de errores en todo momento; para eso existe nuestra{" "}
            <a href="/politica-de-correcciones" className="text-accent-link hover:underline">
              política de correcciones
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Cambios a estos términos</h2>
          <p>
            Podemos actualizar estos términos ocasionalmente. La fecha al inicio de este documento indica la
            última revisión.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Contacto</h2>
          <p>
            Para consultas sobre estos términos, escribe a{" "}
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
