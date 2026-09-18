import type { Access } from "payload";

export const isAdminOrEditorOrAuthor: Access = ({ req: { user } }) => {
  if (!user?.roles) return false;
  return ["admin", "editor", "author"].some((role) => user.roles?.includes(role));
};
