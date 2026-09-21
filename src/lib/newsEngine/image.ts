import type { Payload } from "payload";

type UnsplashPhoto = {
  id: string;
  urls: { regular: string };
  user?: { name?: string };
  links?: { download_location?: string };
};

/** Banco de imágenes con licencia editorial (Unsplash) — nunca generación de imágenes por IA. */
export async function attachFeaturedImage(payload: Payload, query: string, altText: string): Promise<number> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error("UNSPLASH_ACCESS_KEY no está configurada — no se puede generar la imagen destacada.");
  }

  const searchRes = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${accessKey}` } },
  );
  if (!searchRes.ok) {
    throw new Error(`Búsqueda en Unsplash falló con estado ${searchRes.status}.`);
  }
  const searchJson = (await searchRes.json()) as { results?: UnsplashPhoto[] };
  const photo = searchJson.results?.[0];
  if (!photo) {
    throw new Error(`Unsplash no encontró resultados para "${query}".`);
  }

  const imageRes = await fetch(photo.urls.regular);
  if (!imageRes.ok) {
    throw new Error(`No se pudo descargar la imagen de Unsplash (estado ${imageRes.status}).`);
  }
  const buffer = Buffer.from(await imageRes.arrayBuffer());

  const media = await payload.create({
    collection: "media",
    overrideAccess: true,
    data: {
      alt: altText,
      credit: `Foto: ${photo.user?.name ?? "Unsplash"} / Unsplash`,
    },
    file: {
      data: buffer,
      mimetype: "image/jpeg",
      name: `${photo.id}.jpg`,
      size: buffer.length,
    },
  });

  // Requisito de las guías de API de Unsplash: registrar la descarga cuando la foto se usa realmente.
  if (photo.links?.download_location) {
    fetch(photo.links.download_location, { headers: { Authorization: `Client-ID ${accessKey}` } }).catch(() => {});
  }

  return media.id as number;
}
