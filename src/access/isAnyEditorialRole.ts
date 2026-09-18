import type { Access } from "payload";

const EDITORIAL_ROLES = ["admin", "editor", "author", "fact_checker", "seo_manager"];

export const isAnyEditorialRole: Access = ({ req: { user } }) => {
  if (!user?.roles) return false;
  return EDITORIAL_ROLES.some((role) => user.roles?.includes(role));
};
