import type { Access, Where } from "payload";

/**
 * Admin/editor may update any article. An author may only update articles
 * authored by an Authors profile linked to their own user account, and only
 * while that article is still in draft/in_review (they cannot self-publish —
 * see the `status` field's own access rules for the complementary check).
 */
export const canUpdateArticle: Access = async ({ req }) => {
  const { user, payload } = req;
  if (!user) return false;
  if (user.roles?.includes("admin") || user.roles?.includes("editor")) return true;
  if (!user.roles?.includes("author")) return false;

  const linkedAuthors = await payload.find({
    collection: "authors",
    where: { linkedUser: { equals: user.id } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });

  const authorIds = linkedAuthors.docs.map((doc) => doc.id);
  if (authorIds.length === 0) return false;

  const authorCondition: Where = { author: { in: authorIds } };
  const statusCondition: Where = { status: { in: ["draft", "in_review"] } };

  return { and: [authorCondition, statusCondition] };
};
