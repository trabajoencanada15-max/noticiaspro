import Anthropic from "@anthropic-ai/sdk";
import type { BodyBlock } from "./lexical";

const MODEL = "claude-sonnet-5";

const SYSTEM_PROMPT = `Eres un periodista senior de NoticiasPro, un medio digital en español.

Técnica obligatoria — "Giro Periodístico Original":
- Se te da SOLO el título y el resumen/lead de una noticia detectada en un feed RSS de terceros — nunca el artículo completo. Extrae exclusivamente los hechos puros: quién, qué, cuándo, dónde y por qué.
- Con esos hechos, redacta una nota TOTALMENTE NUEVA: estructura propia, oraciones propias, ángulo editorial propio. Nunca traduzcas ni parafrasees línea por línea el resumen original — eso sigue siendo plagio aunque cambies palabras sueltas.
- No inventes citas textuales, cifras ni declaraciones que no estén en el resumen proporcionado. Si el resumen es limitado, sé más breve pero preciso en vez de rellenar con detalles inventados.
- Menciona la fuente original de forma natural en el primer párrafo (ej. "Según informó [fuente]..."), como atribución honesta — sin copiar su redacción.
- Tono: periodístico profesional, atractivo, neutral. Sin opiniones propias salvo que la categoría sea "Opinión".

Estructura semántica obligatoria (SEO):
- El H1 (título principal) lo pone la plantilla del sitio a partir de "title" — tú nunca generas un H1 dentro del cuerpo.
- El cuerpo ("body") es una lista de bloques, cada uno "heading" (solo nivel 2 o 3) o "paragraph".
- Nota breve (4 párrafos o menos de contenido real): sin subtítulos, puro texto corrido.
- Nota más extensa (5+ párrafos): organiza el contenido con 1-3 subtítulos H2 que dividan secciones temáticas lógicas (ej. "Contexto", "Reacciones", "Qué sigue") — nunca un H2 para un solo párrafo suelto, nunca H3 sin un H2 antes, nunca más de un nivel de anidación.
- Cada subtítulo debe describir el contenido real de su sección, no ser genérico ("Contexto" está bien si de verdad da contexto; evita títulos vacíos tipo "Más información").

Devuelve SOLO un objeto JSON válido, sin texto adicional, sin markdown, con este esquema exacto:
{
  "title": "string, máximo 90 caracteres",
  "subtitle": "string, una oración",
  "excerpt": "string, resumen de 1-2 oraciones para tarjetas y meta description por defecto",
  "body": [
    {"type": "paragraph", "text": "string"},
    {"type": "heading", "level": 2, "text": "string"},
    {"type": "paragraph", "text": "string"}
  ],
  "tags": ["string", "string", "..."],
  "metaTitle": "string, MENOS de 60 caracteres, con gancho de CTR",
  "metaDescription": "string, ENTRE 150 y 160 caracteres exactos — ni más corto ni más largo, para aprovechar todo el espacio del snippet de Google",
  "imageQuery": "string EN INGLÉS, 2-4 palabras genéricas que describan la ESCENA visual (no el titular, no nombres propios) para buscar una foto de stock editorial — ej. 'government building meeting', 'rain storm city street', 'courtroom justice gavel', 'soccer stadium match'"
}`;

export type RewriteInput = {
  originalTitle: string;
  originalSummary: string;
  sourceName: string;
  sourceUrl: string;
  categoryName: string;
};

export type RewriteResult = {
  title: string;
  subtitle: string;
  excerpt: string;
  body: BodyBlock[];
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  imageQuery: string;
};

function extractJsonObject(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("La respuesta de IA no contiene un JSON reconocible.");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1).trim()}…` : value;
}

/** Valida y sanea el cuerpo devuelto por el modelo: H1 nunca, solo H2/H3, nunca vacío. */
function sanitizeBody(raw: unknown): BodyBlock[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error("La respuesta de IA no incluyó un cuerpo (body) válido.");
  }

  const blocks: BodyBlock[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const block = entry as { type?: unknown; level?: unknown; text?: unknown };
    if (typeof block.text !== "string" || !block.text.trim()) continue;

    if (block.type === "heading") {
      const level = block.level === 3 ? 3 : 2; // nunca H1, cualquier otro valor cae a H2
      blocks.push({ type: "heading", level, text: block.text.trim() });
    } else {
      blocks.push({ type: "paragraph", text: block.text.trim() });
    }
  }

  if (blocks.every((b) => b.type === "heading")) {
    throw new Error("La respuesta de IA solo trajo subtítulos, sin párrafos de contenido.");
  }
  return blocks;
}

export async function rewriteAsOriginalArticle(input: RewriteInput): Promise<RewriteResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY no está configurada — no se puede generar el borrador.");
  }

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          `Hecho noticioso detectado — fuente: ${input.sourceName}`,
          `Título original: ${input.originalTitle}`,
          `Resumen/lead original: ${input.originalSummary || "(sin resumen disponible)"}`,
          `Categoría del portal: ${input.categoryName}`,
          `Enlace de la fuente (solo para atribución, no lo repitas en el cuerpo): ${input.sourceUrl}`,
        ].join("\n"),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("La respuesta de IA no incluyó contenido de texto.");
  }

  const parsed = extractJsonObject(textBlock.text) as Partial<RewriteResult> & { body?: unknown };

  if (!parsed.title || !parsed.excerpt) {
    throw new Error("La respuesta de IA no cumple el esquema esperado (título/excerpt faltantes).");
  }
  const body = sanitizeBody(parsed.body);

  return {
    title: truncate(parsed.title, 90),
    subtitle: parsed.subtitle ?? "",
    excerpt: parsed.excerpt,
    body,
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : [],
    metaTitle: truncate(parsed.metaTitle || parsed.title, 60),
    metaDescription: truncate(parsed.metaDescription || parsed.excerpt, 160),
    imageQuery: parsed.imageQuery?.trim() || "newspaper journalism",
  };
}
