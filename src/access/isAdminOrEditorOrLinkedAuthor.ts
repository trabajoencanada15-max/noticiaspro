import type { Access } from "payload";

/** Admin/editor can update any author profile; a linked user may only update their own. */
export const isAdminOrEditorOrLinkedAuthor: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.roles?.includes("admin") || user.roles?.includes("editor")) return true;
  return { linkedUser: { equals: user.id } };
};
