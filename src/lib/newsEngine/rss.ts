import Parser from "rss-parser";

const parser = new Parser({ timeout: 15_000 });

export type FeedItem = {
  title: string;
  link: string;
  summary: string;
  publishedAt: string | null;
};

/** Radar de tendencias: solo título + resumen + enlace — nunca el HTML completo del artículo de terceros. */
export async function fetchFeedItems(feedUrl: string): Promise<FeedItem[]> {
  const feed = await parser.parseURL(feedUrl);
  return (feed.items ?? [])
    .filter((item): item is typeof item & { title: string; link: string } => Boolean(item.title && item.link))
    .map((item) => ({
      title: item.title.trim(),
      link: item.link.trim(),
      summary: (item.contentSnippet || item.summary || item.content || "").trim().slice(0, 1000),
      publishedAt: item.isoDate ?? item.pubDate ?? null,
    }));
}
