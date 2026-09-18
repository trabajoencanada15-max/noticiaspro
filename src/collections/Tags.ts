import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "@/access/isAdminOrEditor";
import { isAdminOrEditorOrAuthor } from "@/access/isAdminOrEditorOrAuthor";
import { slugField } from "@/fields/slug";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
    create: isAdminOrEditorOrAuthor,
    update: isAdminOrEditorOrAuthor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    slugField("name"),
  ],
};
