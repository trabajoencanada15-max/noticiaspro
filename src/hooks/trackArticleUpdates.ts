import type { CollectionBeforeChangeHook } from "payload";

/**
 * If a live article is edited without the editor explicitly changing its status
 * (e.g. to retracted/archived), flip it to "updated" and stamp `lastUpdatedAt`.
 * Keeps datePublished immutable while dateModified reflects real edits (see spec §9).
 */
export const trackArticleUpdates: CollectionBeforeChangeHook = ({ data, originalDoc, operation, req }) => {
  if (operation !== "update" || !originalDoc) return data;
  // System-internal writes (e.g. the view counter) must not count as an editorial
  // update — Payload passes hooks the already-merged document, so `data.status`
  // equals `originalDoc.status` even when this specific request never touched it.
  if (req.context?.skipTrackUpdate) return data;

  const wasLive = originalDoc.status === "published" || originalDoc.status === "updated";
  const statusUnchangedByEditor = data.status === originalDoc.status;

  if (wasLive && statusUnchangedByEditor) {
    return {
      ...data,
      status: "updated",
      lastUpdatedAt: new Date().toISOString(),
    };
  }

  return data;
};
