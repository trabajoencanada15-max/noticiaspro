/** Construye un editor state de Lexical mínimo (un párrafo por string) — mismo formato que produce el editor de Payload. */
export function paragraphsToLexicalBody(paragraphs: string[]) {
  return {
    root: {
      type: "root",
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        version: 1,
        children: [
          {
            type: "text",
            text,
            format: 0,
            detail: 0,
            mode: "normal" as const,
            style: "",
            version: 1,
          },
        ],
      })),
    },
  };
}
