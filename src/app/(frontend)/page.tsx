import { Hero } from "@/components/site/Hero";
import { SectionModule } from "@/components/site/SectionModule";
import { MostReadList } from "@/components/site/MostReadList";
import { getCategoryModule, getHeroArticles, getMostRead } from "@/lib/queries";

export const revalidate = 300;

// Curada a propósito: no todas las 9 secciones globales necesitan módulo en portada
// (igual que un diario real prioriza qué mostrar en home vs. solo en el menú).
const HOME_CATEGORY_MODULES = [
  { slug: "politica", title: "Política" },
  { slug: "internacional", title: "Internacional" },
  { slug: "economia", title: "Economía" },
  { slug: "sociedad", title: "Sociedad" },
  { slug: "deportes", title: "Deportes" },
  { slug: "tecnologia", title: "Tecnología" },
];

export default async function HomePage() {
  const [{ lead, secondary }, mostRead, categoryModules] = await Promise.all([
    getHeroArticles(),
    getMostRead(5),
    Promise.all(HOME_CATEGORY_MODULES.map((c) => getCategoryModule(c.slug, 4))),
  ]);

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-8">
      <Hero lead={lead} secondary={secondary} />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="divide-y divide-border">
          {categoryModules.map((module, i) =>
            module ? (
              <SectionModule
                key={module.category.id}
                title={module.category.name}
                href={`/categoria/${module.category.slug}`}
                articles={module.articles}
              />
            ) : (
              <div key={HOME_CATEGORY_MODULES[i].slug} className="hidden" />
            ),
          )}
        </div>
        <aside className="lg:border-l lg:border-border lg:pl-8">
          <MostReadList articles={mostRead} />
        </aside>
      </div>
    </div>
  );
}
