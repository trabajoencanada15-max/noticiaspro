import type { CollectionConfig } from "payload";
import { isAdmin } from "@/access/isAdmin";
import { isAdminOrEditorOrSelfUser } from "@/access/isAdminOrEditorOrSelfUser";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: isAdmin,
    update: isAdminOrEditorOrSelfUser,
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["author"],
      options: [
        { label: "Administrador", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Autor", value: "author" },
        { label: "Fact-checker", value: "fact_checker" },
        { label: "SEO Manager", value: "seo_manager" },
      ],
      access: {
        // Only an admin may grant/change roles.
        update: ({ req: { user } }) => Boolean(user?.roles?.includes("admin")),
      },
    },
  ],
};
