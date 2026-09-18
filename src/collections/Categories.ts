import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "@/access/isAdminOrEditor";
import { slugField } from "@/fields/slug";
import { makeTaxonomyRevalidateHooks } from "@/hooks/revalidateTaxonomy";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "parent", "showInNav", "order"],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: makeTaxonomyRevalidateHooks("categories"),
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    slugField("name"),
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      admin: { description: "Ej.: República Dominicana › Santiago" },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Controla el orden en la navegación y la portada." },
    },
    {
      name: "showInNav",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "accentColor",
      type: "select",
      options: [
        { label: "Ninguno", value: "" },
        { label: "Rojo (breaking)", value: "accent" },
        { label: "Azul (info)", value: "info-updated" },
        { label: "Verde (verificado)", value: "verified" },
        { label: "Ámbar (corrección)", value: "warning-correction" },
      ],
    },
  ],
};
