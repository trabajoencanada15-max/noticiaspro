import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-5";

const SYSTEM_PROMPT = `Eres un periodista senior de NoticiasPro, un medio digital en español.

Técnica obligatoria — "Giro Periodístico Original":
- Se te da SOLO el título y el resumen/lead de una noticia detectada en un feed RSS de terceros — nunca el artículo completo. Extrae exclusivamente los hechos puros: quién, qué, cuándo, dónde y por qué.
- Con esos hechos, redacta una nota TOTALMENTE NUEVA: estructura propia, oraciones propias, ángulo editorial propio. Nunca traduzcas ni parafrasees línea por línea el resumen original — eso sigue siendo plagio aunque cambies palabras sueltas.
- No inventes citas textuales, cifras ni declaraciones que no estén en el resumen proporcionado. Si el resumen es limitado, sé más breve pero preciso en vez de rellenar con detalles inventados.
- Menciona la fuente original de forma natural en el primer párrafo (ej. "Según informó [fuente]..."), como atribución honesta — sin copiar su redacción.
- Tono: periodístico profesional, atractivo, neutral. Sin opiniones propias salvo que la categoría sea "Opinión".
- El cuerpo debe tener entre 4 y 6 párrafos.

Devuelve SOLO un objeto JSON válido, sin texto adicional, sin markdown, con este esquema exacto:
{
  "title": "string, máximo 90 caracteres",
  "subtitle": "string, una oración",
  "excerpt": "string, resumen de 1-2 oraciones para tarjetas y meta description por defecto",
  "bodyParagraphs": ["string", "string", "..."],
  "tags": ["string", "string", "..."],
  "metaTitle": "string, MENOS de 60 caracteres, con gancho de CTR",
  "metaDescription": "string, MENOS de 150 caracteres"
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
  bodyParagraphs: string[];
  tags: string[];
  metaTitle: string;
  metaDescription: string;
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

  const parsed = extractJsonObject(textBlock.text) as Partial<RewriteResult>;

  if (
    !parsed.title ||
    !parsed.excerpt ||
    !Array.isArray(parsed.bodyParagraphs) ||
    parsed.bodyParagraphs.length === 0
  ) {
    throw new Error("La respuesta de IA no cumple el esquema esperado (título/excerpt/cuerpo faltantes).");
  }

  return {
    title: truncate(parsed.title, 90),
    subtitle: parsed.subtitle ?? "",
    excerpt: parsed.excerpt,
    bodyParagraphs: parsed.bodyParagraphs,
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : [],
    metaTitle: truncate(parsed.metaTitle || parsed.title, 60),
    metaDescription: truncate(parsed.metaDescription || parsed.excerpt, 150),
  };
}
