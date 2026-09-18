import type { Field } from "payload";

/** Reusable per-document SEO group: meta title/description, canonical, OG/Twitter overrides. */
export const seoField: Field = {
  name: "seo",
  type: "group",
  label: "SEO",
  admin: {
    position: "sidebar",
  },
  fields: [
    {
      name: "metaTitle",
      type: "text",
      admin: { description: "Si se deja vacío, se usa el título del artículo." },
    },
    {
      name: "metaDescription",
      type: "textarea",
      admin: { description: "Si se deja vacío, se usa el resumen (excerpt)." },
    },
    {
      name: "canonicalUrl",
      type: "text",
      admin: { description: "Solo si esta URL no es la versión canónica del contenido." },
    },
    {
      name: "ogTitle",
      type: "text",
    },
    {
      name: "ogImage",
      type: "relationship",
      relationTo: "media",
      admin: { description: "Si se deja vacío, se usa la imagen destacada." },
    },
    {
      name: "twitterCardType",
      type: "select",
      defaultValue: "summary_large_image",
      options: [
        { label: "Summary", value: "summary" },
        { label: "Summary Large Image", value: "summary_large_image" },
      ],
    },
  ],
};
