import type { GlobalAfterChangeHook } from "payload";
import { revalidateTag } from "next/cache";

export const revalidateBreakingNewsAfterChange: GlobalAfterChangeHook = ({ doc, req }) => {
  if (!req.context?.disableRevalidate) {
    revalidateTag("breaking-news", "max");
  }
  return doc;
};
