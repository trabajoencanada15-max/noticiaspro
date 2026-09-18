import type { Access } from "payload";

const EDITORIAL_ROLES = ["admin", "editor", "author", "fact_checker", "seo_manager"];

/** Public visitors only ever see published/updated content; staff sees every status. */
export const publishedOnly: Access = ({ req: { user } }) => {
  if (user?.roles && EDITORIAL_ROLES.some((role) => user.roles?.includes(role))) {
    return true;
  }
  return {
    status: { in: ["published", "updated"] },
  };
};
