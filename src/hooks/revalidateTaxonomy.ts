import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidateTag } from "next/cache";

/** Shared by Categories and Regions — editorial taxonomy that backs nav menus
 * and static params, so edits should reflect promptly instead of waiting for
 * the 300s fallback `revalidate` window (same reasoning as Articles/BreakingNews). */
export function makeTaxonomyRevalidateHooks(tag: string) {
  const afterChange: CollectionAfterChangeHook = ({ doc, req }) => {
    if (!req.context?.disableRevalidate) revalidateTag(tag, "max");
    return doc;
  };
  const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
    if (!req.context?.disableRevalidate) revalidateTag(tag, "max");
    return doc;
  };
  return { afterChange: [afterChange], afterDelete: [afterDelete] };
}
