import type { CollectionBeforeChangeHook } from "payload";

const WORDS_PER_MINUTE = 200;

type LexicalNode = {
  text?: string;
  children?: LexicalNode[];
};

function extractText(node: LexicalNode | undefined): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  if (Array.isArray(node.children)) {
    return node.children.map(extractText).join(" ");
  }
  return "";
}

/** Derives `readingTime` (minutes) from the Lexical `body` field so it's stable and queryable. */
export const computeReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  const root = data?.body?.root as LexicalNode | undefined;
  const text = extractText(root);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return {
    ...data,
    readingTime: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
  };
};
