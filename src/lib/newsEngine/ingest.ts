import type { Payload } from "payload";
import { fetchFeedItems } from "./rss";
import { hashTitle } from "./dedup";
import { categorizeItem } from "./categorize";
import { rewriteAsOriginalArticle } from "./rewrite";
import { attachFeaturedImage } from "./image";
import { paragraphsToLexicalBody } from "./lexical";

export type IngestSummary = {
  sourcesChecked: number;
  itemsSeen: number;
  drafted: number;
  skippedDuplicate: number;
  skippedNoCategory: number;
  failed: number;
};

const DEFAULT_AUTHOR_SLUG = process.env.AI_INGESTION_AUTHOR_SLUG || "redaccion-noticiaspro";
const MAX_ITEMS_PER_FEED = 20;

async function resolveOrCreateTags(payload: Payload, names: string[]): Promise<number[]> {
  const ids: number[] = [];
  for (const rawName of names) {
    const name = rawName.trim();
    if (!name) continue;

    const existing = await payload.find({
      collection: "tags",
      where: { name: { equals: name } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs[0]) {
      ids.push(existing.docs[0].id as number);
      continue;
    }

    try {
      const created = await payload.create({
        collection: "tags",
        overrideAccess: true,
        data: { name },
      });
      ids.push(created.id as number);
    } catch {
      // Colisión de unicidad por carrera entre ítems del mismo batch — no es crítico, se omite el tag.
    }
  }
  return ids;
}

/** Orquestador del motor de ingestión — ver plan: radar de tendencias + reescritura original + revisión humana obligatoria. */
export async function runIngestion(payload: Payload): Promise<IngestSummary> {
  const summary: IngestSummary = {
    sourcesChecked: 0,
    itemsSeen: 0,
    drafted: 0,
    skippedDuplicate: 0,
    skippedNoCategory: 0,
    failed: 0,
  };

  const sourcesRes = await payload.find({
    collection: "sources",
    where: { ingestionActive: { equals: true } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });

  const authorRes = await payload.find({
    collection: "authors",
    where: { slug: { equals: DEFAULT_AUTHOR_SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const defaultAuthorId = authorRes.docs[0]?.id as number | undefined;
  if (!defaultAuthorId) {
    throw new Error(
      `No existe un autor con slug "${DEFAULT_AUTHOR_SLUG}" — crea un perfil de Autor para el contenido asistido por IA antes de activar la ingestión.`,
    );
  }

  for (const source of sourcesRes.docs) {
    summary.sourcesChecked += 1;
    const feedUrl = source.feedUrl as string | undefined;
    if (!feedUrl) continue;

    let items;
    try {
      items = await fetchFeedItems(feedUrl);
    } catch {
      continue; // Fallo a nivel de feed (red/formato) — se reintenta en la próxima corrida.
    }

    for (const item of items.slice(0, MAX_ITEMS_PER_FEED)) {
      summary.itemsSeen += 1;
      const titleHash = hashTitle(item.title);

      const existing = await payload.find({
        collection: "ingested-items",
        where: { or: [{ originalUrl: { equals: item.link } }, { titleHash: { equals: titleHash } }] },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      if (existing.docs.length > 0) {
        summary.skippedDuplicate += 1;
        continue;
      }

      const ingested = await payload.create({
        collection: "ingested-items",
        overrideAccess: true,
        data: {
          title: item.title,
          sourceFeed: source.id,
          originalUrl: item.link,
          titleHash,
          originalPublishedAt: item.publishedAt ?? undefined,
          status: "detected",
        },
      });

      try {
        const matchedCategory = await categorizeItem(payload, `${item.title} ${item.summary}`);
        const categoryId = matchedCategory?.id ?? (source.categoryHint as number | undefined);

        if (!categoryId) {
          await payload.update({
            collection: "ingested-items",
            id: ingested.id,
            overrideAccess: true,
            data: { status: "skipped_no_category", processedAt: new Date().toISOString() },
          });
          summary.skippedNoCategory += 1;
          continue;
        }

        await payload.update({
          collection: "ingested-items",
          id: ingested.id,
          overrideAccess: true,
          data: { status: "drafting" },
        });

        const categoryDoc =
          matchedCategory ??
          ((await payload.findByID({
            collection: "categories",
            id: categoryId,
            depth: 0,
            overrideAccess: true,
          })) as unknown as { id: number; name: string });

        const rewritten = await rewriteAsOriginalArticle({
          originalTitle: item.title,
          originalSummary: item.summary,
          sourceName: (source.name as string) ?? "Fuente externa",
          sourceUrl: item.link,
          categoryName: categoryDoc.name,
        });

        const imageId = await attachFeaturedImage(payload, rewritten.title, rewritten.title);
        const tagIds = await resolveOrCreateTags(payload, rewritten.tags);

        const article = await payload.create({
          collection: "articles",
          overrideAccess: true,
          data: {
            title: rewritten.title,
            subtitle: rewritten.subtitle || undefined,
            status: "in_review",
            author: defaultAuthorId,
            category: categoryId,
            tags: tagIds,
            featuredImage: imageId,
            excerpt: rewritten.excerpt,
            body: paragraphsToLexicalBody(rewritten.bodyParagraphs),
            aiGenerated: true,
            sourceReferences: [{ source: source.id, note: item.title, url: item.link }],
            seo: {
              metaTitle: rewritten.metaTitle,
              metaDescription: rewritten.metaDescription,
            },
          },
        });

        await payload.update({
          collection: "ingested-items",
          id: ingested.id,
          overrideAccess: true,
          data: { status: "drafted", article: article.id, processedAt: new Date().toISOString() },
        });
        summary.drafted += 1;
      } catch (err) {
        await payload.update({
          collection: "ingested-items",
          id: ingested.id,
          overrideAccess: true,
          data: {
            status: "failed",
            errorMessage: err instanceof Error ? err.message : String(err),
            processedAt: new Date().toISOString(),
          },
        });
        summary.failed += 1;
      }
    }
  }

  return summary;
}
