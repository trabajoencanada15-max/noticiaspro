import type { Access } from "payload";

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  if (!user?.roles) return false;
  return user.roles.includes("admin") || user.roles.includes("editor");
};
