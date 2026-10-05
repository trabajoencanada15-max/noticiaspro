import { SITE_URL } from "@/lib/constants";

/**
 * Protocolo IndexNow (indexnow.org) — notifica a Bing/Yandex/Seznam al
 * instante cuando se publica o actualiza una URL. Google NO participa en
 * este protocolo; para Google la vía real es Search Console + sitemap
 * (ver política editorial / plan de SEO).
 *
 * La clave es pública por diseño (así es como IndexNow verifica que el
 * sitio es dueño de las URLs que notifica) — se sirve en
 * public/<key>.txt, sin necesidad de variable de entorno.
 */
const INDEXNOW_KEY = "0b70a408be9c1c3611835709e7c7b49c";

export async function notifyIndexNow(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  try {
    const host = new URL(SITE_URL).host;
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
  } catch {
    // Best-effort — un fallo notificando a Bing nunca debe tumbar la
    // publicación del artículo en sí.
  }
}
