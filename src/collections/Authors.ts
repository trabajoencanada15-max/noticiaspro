import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "@/access/isAdminOrEditor";
import { isAdminOrEditorOrLinkedAuthor } from "@/access/isAdminOrEditorOrLinkedAuthor";
import { slugField } from "@/fields/slug";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditorOrLinkedAuthor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    slugField("name"),
    {
      name: "avatar",
      type: "relationship",
      relationTo: "media",
    },
    {
      name: "bio",
      type: "textarea",
    },
    {
      name: "roleTitle",
      type: "text",
      admin: { description: 'Ej.: "Redactora Jefe", "Corresponsal en Santiago"' },
    },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "X (Twitter)", value: "x" },
            { label: "Facebook", value: "facebook" },
            { label: "Instagram", value: "instagram" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "Sitio web", value: "web" },
          ],
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "linkedUser",
      type: "relationship",
      relationTo: "users",
      unique: true,
      admin: {
        position: "sidebar",
        description: "Cuenta de acceso vinculada a este perfil (opcional).",
      },
    },
  ],
};
