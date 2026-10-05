export type BodyBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string };

function textNode(text: string) {
  return {
    type: "text",
    text,
    format: 0,
    detail: 0,
    mode: "normal" as const,
    style: "",
    version: 1,
  };
}

/**
 * Construye un editor state de Lexical — mismo formato que produce el editor
 * de Payload — a partir de bloques tipados (párrafo o subtítulo H2/H3). El
 * H1 lo pone la plantilla del artículo con el título; aquí nunca se genera
 * un nivel 1, para mantener una jerarquía semántica limpia.
 */
export function blocksToLexicalBody(blocks: BodyBlock[]) {
  return {
    root: {
      type: "root",
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      version: 1,
      children: blocks.map((block) =>
        block.type === "heading"
          ? {
              type: "heading",
              tag: `h${block.level}` as const,
              direction: "ltr" as const,
              format: "" as const,
              indent: 0,
              version: 1,
              children: [textNode(block.text)],
            }
          : {
              type: "paragraph",
              direction: "ltr" as const,
              format: "" as const,
              indent: 0,
              version: 1,
              children: [textNode(block.text)],
            },
      ),
    },
  };
}
