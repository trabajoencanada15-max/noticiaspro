import type { Payload } from "payload";

/** Flips due `scheduled` articles to `published`. Invoked by the Vercel Cron route, not a collection hook. */
export async function autoPublishScheduledArticles(payload: Payload): Promise<{ published: number }> {
  const now = new Date().toISOString();

  const due = await payload.find({
    collection: "articles",
    where: {
      and: [{ status: { equals: "scheduled" } }, { scheduledAt: { less_than_equal: now } }],
    },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });

  for (const article of due.docs) {
    await payload.update({
      collection: "articles",
      id: article.id,
      overrideAccess: true,
      data: {
        status: "published",
        publishedAt: article.publishedAt ?? article.scheduledAt ?? now,
      },
    });
  }

  return { published: due.docs.length };
}
