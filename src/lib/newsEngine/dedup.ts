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

const STOPWORDS = new Set([
  "de", "la", "el", "en", "y", "a", "los", "las", "un", "una", "unos", "unas",
  "por", "con", "su", "sus", "que", "se", "del", "al", "para", "es", "lo",
  "como", "mas", "pero", "ya", "o", "este", "esta", "estos", "estas", "entre",
  "sin", "sobre", "tambien", "tras", "durante", "hasta", "desde", "contra",
  "le", "les", "me", "nos", "fue", "ser", "son", "han", "ha", "no", "si",
  // Sustantivos genéricos de noticias — aparecen en historias muy distintas
  // sobre la misma institución/tema y por sí solos no identifican el hecho
  // (probado con pares reales: sin esto, "Banco Central" colisionaba falsos
  // positivos entre noticias de países y medidas totalmente distintas).
  "gobierno", "congreso", "presidente", "ministerio", "banco", "central",
  "tasa", "interes", "ley", "decreto", "decretos", "pais", "nacional",
  "publico", "publica", "millones", "anos", "ano", "dia", "dias", "segun",
  "nueva", "nuevo", "informa", "revela", "anuncia", "evalua",
]);

/** Palabras con peso semántico de un título — ignora conectores y tokens muy cortos. */
export function significantWords(title: string): Set<string> {
  const words = normalizeTitle(title).split(" ").filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return new Set(words);
}

/** Similitud de Jaccard entre los conjuntos de palabras significativas de dos títulos. */
export function titleSimilarity(a: string, b: string): number {
  const setA = significantWords(a);
  const setB = significantWords(b);
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection += 1;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
