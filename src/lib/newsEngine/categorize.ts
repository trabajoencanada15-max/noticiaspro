import type { Payload } from "payload";

/**
 * Clasificación por palabras clave ponderadas (spec §3) contra las 9
 * secciones temáticas globales reales del portal — ver los slugs creados
 * en la expansión de arquitectura editorial (Categories). Bilingüe
 * (ES/EN) porque las fuentes internacionales (Reuters, BBC, TechCrunch)
 * titulan en inglés.
 */
const KEYWORD_RULES: Record<string, string[]> = {
  politica: [
    "election", "elecciones", "president", "presidente", "congress", "congreso",
    "senado", "senate", "gobierno", "government", "parliament", "parlamento",
    "primer ministro", "prime minister", "voto", "vote", "campaña electoral",
    "campaign", "partido político", "political party",
  ],
  internacional: [
    "war", "guerra", "united nations", "naciones unidas", " onu ", "nato", "otan",
    "embassy", "embajada", "foreign minister", "canciller", "border", "frontera",
    "invasion", "invasión", "treaty", "tratado", "diplomacy", "diplomacia",
  ],
  economia: [
    "economy", "economía", "inflation", "inflación", "market", "mercado", "stock",
    "bolsa", "interest rate", "tasa de interés", "gdp", "pib", "recession",
    "recesión", "trade", "comercio", "central bank", "banco central", "dólar", "dollar",
  ],
  tecnologia: [
    "technology", "tecnología", " ai ", "inteligencia artificial", "startup", " app ",
    "software", "chip", "semiconductor", "smartphone", "google", "apple", "microsoft",
    "meta", "openai", "robot", "cyberattack", "ciberataque",
  ],
  ciencia: [
    "science", "ciencia", "nasa", "space", "espacio", "study finds", "estudio",
    "research", "investigación", "discovery", "descubrimiento", "physics", "física",
    "biology", "biología", "climate", "clima", "vaccine", "vacuna",
  ],
  cultura: [
    "culture", "cultura", "film", "película", "music", "música", " art ", "arte",
    "museum", "museo", "festival", "literature", "literatura", "cine", "actor", "director",
  ],
  deportes: [
    "football", "fútbol", "soccer", "nba", "basketball", "baloncesto", "olympic",
    "olímpico", "tournament", "torneo", "championship", "campeonato", "partido",
    "jugador", "player", "coach", "entrenador",
  ],
  sociedad: [
    "society", "sociedad", "education", "educación", "health", "salud", "crime",
    "crimen", "protest", "protesta", "community", "comunidad", "immigration",
    "inmigración", "housing", "vivienda",
  ],
  opinion: ["opinion", "opinión", "editorial", "analysis", "análisis", "column", "columna"],
};

export type CategoryMatch = { id: number; slug: string; name: string };

export async function categorizeItem(payload: Payload, text: string): Promise<CategoryMatch | null> {
  const normalized = ` ${text.toLowerCase()} `;
  let bestSlug: string | null = null;
  let bestScore = 0;

  for (const [slug, keywords] of Object.entries(KEYWORD_RULES)) {
    const score = keywords.reduce((acc, kw) => (normalized.includes(kw) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      bestSlug = slug;
    }
  }

  if (!bestSlug || bestScore < 1) return null;

  const res = await payload.find({
    collection: "categories",
    where: { slug: { equals: bestSlug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const category = res.docs[0] as { id: number; slug: string; name: string } | undefined;
  if (!category) return null;
  return { id: category.id, slug: category.slug, name: category.name };
}
