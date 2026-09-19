import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Qué cookies y almacenamiento local usa NoticiasPro hoy.",
};

export default function CookiesPolicyPage() {
  const breadcrumbItems = [{ name: "Portada", href: "/" }, { name: "Cookies" }];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-3 border-b border-border pb-6">
        <h1 className="font-serif text-h1 font-bold">Política de cookies</h1>
        <p className="mt-2 max-w-2xl text-body-lg text-muted-foreground">
          Un resumen honesto de qué guardamos en tu navegador hoy — y qué no.
        </p>
      </header>

      <div className="prose-article mt-8 text-base leading-relaxed">
        <section>
          <h2 className="text-h3 font-serif font-semibold">Estado actual</h2>
          <p>
            NoticiasPro <strong>no utiliza actualmente cookies de analítica ni de publicidad</strong>. No tenemos
            integrado Google Analytics ni Google AdSense ni ningún otro servicio de rastreo de terceros.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Lo único que guardamos: tu preferencia de tema</h2>
          <p>
            Cuando eliges entre modo claro y oscuro, esa elección se guarda en el almacenamiento local de tu
            navegador (<code>localStorage</code>), no en una cookie tradicional. Este dato nunca sale de tu
            navegador, no se envía a nuestros servidores y no se usa para identificarte ni para seguimiento.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-serif font-semibold">Categorías de cookies, para referencia</h2>
          <p>Si en el futuro incorporamos cookies, estas serán las categorías que aplicarían:</p>
          <ul>
            <li><strong>Necesarias</strong> — imprescindibles para el funcionamiento básico del sitio.</li>
            <li><strong>Preferencias</strong> — como el tema visual, ya descrito arriba.</li>
            <li>
              <strong>Analítica</strong> — para entender cómo se usa el sitio de forma agregada. No están activas
              hoy.
            </li>
            <li>
              <strong>Publicidad</strong> — asociadas a la muestra de anuncios, por ejemplo de Google AdSense. No
              están activas hoy.
            </li>
          </ul>
          <p>
            Si activamos categorías de analítica o publicidad, actualizaremos esta página con el detalle de cada
            cookie y mostraremos un aviso de consentimiento antes de activarlas, conforme a lo indicado en nuestra{" "}
            <Link href="/politica-de-privacidad" className="text-accent-link hover:underline">
              política de privacidad
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
