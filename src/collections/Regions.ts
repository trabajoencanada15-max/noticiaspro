import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "@/access/isAdminOrEditor";
import { slugField } from "@/fields/slug";
import { makeTaxonomyRevalidateHooks } from "@/hooks/revalidateTaxonomy";

/**
 * Geographic edition — independent from Categories (topic). An article can
 * belong to a topic (Política) and, separately/optionally, to a region
 * (España) — see spec: regional edition selector, El País/Infobae pattern.
 */
export const Regions: CollectionConfig = {
  slug: "regions",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "showInSelector", "order"],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: makeTaxonomyRevalidateHooks("regions"),
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    slugField("name"),
    {
      name: "flagEmoji",
      type: "text",
      admin: { description: "Ej.: 🇩🇴 — evita depender de assets de imagen para el selector." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Controla el orden en el selector de ediciones." },
    },
    {
      name: "showInSelector",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
