import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidatePath, revalidateTag } from "next/cache";

export const revalidateArticleAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req,
}) => {
  if (!req.context?.disableRevalidate) {
    revalidateTag("articles", "max");
    if (doc?.slug) revalidatePath(`/articulo/${doc.slug}`);
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
      revalidatePath(`/articulo/${previousDoc.slug}`);
    }
  }
  return doc;
};

export const revalidateArticleAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!req.context?.disableRevalidate) {
    revalidateTag("articles", "max");
    if (doc?.slug) revalidatePath(`/articulo/${doc.slug}`);
  }
  return doc;
};
