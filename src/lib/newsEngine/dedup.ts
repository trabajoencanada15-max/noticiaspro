import { createHash } from "crypto";

export function normalizeTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Detecta la misma noticia repetida entre feeds distintos, no solo la misma URL. */
export function hashTitle(title: string): string {
  return createHash("sha256").update(normalizeTitle(title)).digest("hex");
}
