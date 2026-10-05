import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidatePath, revalidateTag } from "next/cache";
import { notifyIndexNow } from "@/lib/newsEngine/indexnow";
import { SITE_URL } from "@/lib/constants";

const PUBLIC_STATUSES = new Set(["published", "updated"]);

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
    // Bing/Yandex vía IndexNow — solo para lo que de verdad es público ya.
    if (doc?.slug && PUBLIC_STATUSES.has(doc.status)) {
      void notifyIndexNow([`${SITE_URL}/articulo/${doc.slug}`]);
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
