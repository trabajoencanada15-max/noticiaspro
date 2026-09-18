import Link from "next/link";
import { Logo } from "@/components/site/Logo";

const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Contacto", href: "/contacto" },
  { label: "Política editorial", href: "/politica-editorial" },
  { label: "Correcciones", href: "/politica-de-correcciones" },
  { label: "Privacidad", href: "/politica-de-privacidad" },
  { label: "Cookies", href: "/cookies" },
  { label: "Términos", href: "/terminos-y-condiciones" },
  { label: "Publicidad", href: "/publicidad" },
  { label: "Autores", href: "/autores" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-10">
        <Logo />
        <nav aria-label="Enlaces de pie de página" className="mt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-8 text-caption text-muted-foreground">
          © {new Date().getFullYear()} NoticiasPro. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
