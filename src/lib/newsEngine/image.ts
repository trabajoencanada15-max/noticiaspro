import type { Payload } from "payload";

type StockPhoto = {
  id: string;
  imageUrl: string;
  credit: string;
  provider: "unsplash" | "pexels";
  downloadLocation?: string;
};

async function searchUnsplash(query: string): Promise<StockPhoto | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${accessKey}` } },
  );
  if (!res.ok) return null;

  const json = (await res.json()) as {
    results?: { id: string; urls: { regular: string }; user?: { name?: string }; links?: { download_location?: string } }[];
  };
  const photo = json.results?.[0];
  if (!photo) return null;

  return {
    id: photo.id,
    imageUrl: photo.urls.regular,
    credit: `Foto: ${photo.user?.name ?? "Unsplash"} / Unsplash`,
    provider: "unsplash",
    downloadLocation: photo.links?.download_location,
  };
}

async function searchPexels(query: string): Promise<StockPhoto | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: apiKey } },
  );
  if (!res.ok) return null;

  const json = (await res.json()) as {
    photos?: { id: number; src: { large: string }; photographer?: string }[];
  };
  const photo = json.photos?.[0];
  if (!photo) return null;

  return {
    id: String(photo.id),
    imageUrl: photo.src.large,
    credit: `Foto: ${photo.photographer ?? "Pexels"} / Pexels`,
    provider: "pexels",
  };
}

/**
 * Banco de imágenes con licencia editorial — nunca generación/edición de
 * imágenes por IA, y nunca la foto del artículo original de terceros (ver
 * plan: "reeditar" una foto ajena no elimina el problema de derechos de
 * autor, solo lo disimula). `query` debe ser una consulta visual corta en
 * inglés (no el titular completo en español).
 *
 * Unsplash es el proveedor principal; si falla (cuota, 403, sin resultados)
 * cae a Pexels — y si la consulta específica no da nada en ningún proveedor,
 * se reintenta con un término genérico antes de rendirse.
 */
export async function attachFeaturedImage(payload: Payload, query: string, altText: string): Promise<number> {
  if (!process.env.UNSPLASH_ACCESS_KEY && !process.env.PEXELS_API_KEY) {
    throw new Error("No hay UNSPLASH_ACCESS_KEY ni PEXELS_API_KEY configuradas — no se puede generar la imagen destacada.");
  }

  const photo =
    (await searchUnsplash(query)) ??
    (await searchPexels(query)) ??
    (await searchUnsplash("newspaper journalism")) ??
    (await searchPexels("newspaper journalism"));

  if (!photo) {
    throw new Error(`Ningún banco de imágenes encontró resultados para "${query}" ni para el respaldo genérico.`);
  }

  const imageRes = await fetch(photo.imageUrl);
  if (!imageRes.ok) {
    throw new Error(`No se pudo descargar la imagen de ${photo.provider} (estado ${imageRes.status}).`);
  }
  const buffer = Buffer.from(await imageRes.arrayBuffer());

  const media = await payload.create({
    collection: "media",
    overrideAccess: true,
    data: {
      alt: altText,
      credit: photo.credit,
    },
    file: {
      data: buffer,
      mimetype: "image/jpeg",
      name: `${photo.provider}-${photo.id}.jpg`,
      size: buffer.length,
    },
  });

  // Requisito de las guías de API de Unsplash: registrar la descarga cuando la foto se usa realmente.
  if (photo.provider === "unsplash" && photo.downloadLocation) {
    fetch(photo.downloadLocation, {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    }).catch(() => {});
  }

  return media.id as number;
}
