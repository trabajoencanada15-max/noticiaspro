import type { CollectionConfig } from "payload";
import { isAdminOrEditorOrAuthor } from "@/access/isAdminOrEditorOrAuthor";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
  },
  access: {
    read: () => true,
    create: isAdminOrEditorOrAuthor,
    update: isAdminOrEditorOrAuthor,
    delete: isAdminOrEditorOrAuthor,
  },
  upload: {
    imageSizes: [
      { name: "thumbnail", width: 400 },
      { name: "card", width: 800 },
      { name: "hero", width: 1600 },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
    adminThumbnail: "card",
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Texto alternativo — obligatorio por accesibilidad y SEO." },
    },
    {
      name: "caption",
      type: "text",
    },
    {
      name: "credit",
      type: "text",
      admin: { description: "Fotógrafo, agencia o titular del copyright." },
    },
  ],
};
