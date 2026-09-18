import type { GlobalConfig } from "payload";
import { isAdminOrEditor } from "@/access/isAdminOrEditor";
import { revalidateBreakingNewsAfterChange } from "@/hooks/revalidateBreakingNews";

export const BreakingNews: GlobalConfig = {
  slug: "breaking-news",
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateBreakingNewsAfterChange],
  },
  fields: [
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "article",
      type: "relationship",
      relationTo: "articles",
    },
    {
      name: "customText",
      type: "text",
      admin: { description: "Opcional: sustituye el titular del artículo enlazado." },
    },
    {
      name: "expiresAt",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        description: "Opcional: oculta la barra automáticamente tras esta fecha.",
      },
    },
  ],
};
