import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const metadata: Metadata = {
  title: "Verificación de diseño",
  robots: { index: false, follow: false },
};

const colorTokens = [
  { name: "background", label: "Fondo" },
  { name: "foreground", label: "Texto" },
  { name: "primary", label: "Primario (tinta)" },
  { name: "accent", label: "Acento (breaking)" },
  { name: "accent-link", label: "Acento (texto/enlaces)" },
  { name: "secondary", label: "Secundario" },
  { name: "muted", label: "Muted" },
  { name: "verified", label: "Verificado" },
  { name: "warning-correction", label: "Corrección" },
  { name: "info-updated", label: "Actualizado" },
  { name: "destructive", label: "Destructivo" },
] as const;

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-[var(--content-max-width)] space-y-16 px-4 py-12">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-overline font-sans uppercase tracking-[var(--text-overline--letter-spacing)] text-muted-foreground">
            NoticiasPro / Design System
          </p>
          <h1 className="font-serif text-h1 font-semibold">Verificación visual</h1>
        </div>
        <ThemeToggle />
      </header>

      <section className="space-y-4">
        <h2 className="font-serif text-h3 font-semibold">Escala tipográfica</h2>
        <div className="space-y-2">
          <p className="font-serif text-display font-semibold">Titular display</p>
          <p className="font-serif text-h1 font-semibold">Titular H1 — última hora en el país</p>
          <p className="font-serif text-h2 font-semibold">Titular H2 — política y economía</p>
          <p className="font-serif text-h3 font-semibold">Titular H3 — sección</p>
          <p className="font-serif text-h4 font-semibold">Titular H4 — tarjeta</p>
          <p className="text-body-lg">
            Cuerpo grande: párrafo de apertura de un artículo, pensado para máxima legibilidad.
          </p>
          <p className="text-base">
            Cuerpo estándar: el texto principal de un artículo se compone en esta talla.
          </p>
          <p className="text-caption text-muted-foreground">Caption / pie de foto / crédito</p>
          <p className="text-overline uppercase tracking-[var(--text-overline--letter-spacing)] text-muted-foreground">
            Overline / etiqueta de categoría
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-h3 font-semibold">Colores de marca</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {colorTokens.map((token) => (
            <div key={token.name} className="space-y-2">
              <div
                className="h-16 rounded-lg border border-border"
                style={{ background: `var(--${token.name})` }}
              />
              <p className="text-caption text-muted-foreground">{token.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-h3 font-semibold">Botones</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primario</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructivo</Button>
          <Button variant="link">Enlace</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Pequeño</Button>
          <Button size="default">Normal</Button>
          <Button size="lg">Grande</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-h3 font-semibold">Badges de estado editorial</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Estándar</Badge>
          <Badge variant="destructive">Última hora</Badge>
          <Badge variant="outline">Opinión</Badge>
          <Badge variant="secondary">Actualizado</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-h3 font-semibold">Tarjeta de artículo (base)</h2>
        <Card className="max-w-md">
          <CardHeader>
            <Badge variant="destructive" className="mb-2 w-fit">
              Última hora
            </Badge>
            <CardTitle className="font-serif text-h4">
              Ejemplo de titular para una tarjeta de portada
            </CardTitle>
            <CardDescription>
              Resumen breve del artículo que aparece debajo del titular en la tarjeta.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>NP</AvatarFallback>
            </Avatar>
            <div className="text-caption text-muted-foreground">
              <p>Redacción NoticiasPro</p>
              <p>Hace 12 minutos · 3 min de lectura</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-h3 font-semibold">Alertas editoriales</h2>
        <Alert>
          <AlertTitle>Verificado por NoticiasPro</AlertTitle>
          <AlertDescription>Contenido revisado por la redacción antes de publicar.</AlertDescription>
        </Alert>
        <Alert className="border-warning-correction/40 bg-warning-correction/10">
          <AlertTitle>Corrección</AlertTitle>
          <AlertDescription>
            Una versión anterior de este artículo indicaba una cifra incorrecta.
          </AlertDescription>
        </Alert>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-h3 font-semibold">Skeleton / carga</h2>
        <div className="max-w-md space-y-2">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </section>

      <Separator />

      <footer className="text-caption text-muted-foreground">
        Página interna, no indexable — sirve para verificar tipografía, color y modo oscuro antes
        de construir la portada real.
      </footer>
    </main>
  );
}
