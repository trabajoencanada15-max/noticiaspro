import type { Access } from "payload";

/** Admin/editor can update any user; anyone else may only update their own account. */
export const isAdminOrEditorOrSelfUser: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.roles?.includes("admin") || user.roles?.includes("editor")) return true;
  return { id: { equals: user.id } };
};
