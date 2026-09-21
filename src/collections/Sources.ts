import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "@/access/isAdminOrEditor";
import { isAnyEditorialRole } from "@/access/isAnyEditorialRole";

/**
 * Structural reference data only — no ingestion/scraping logic. Lets editors
 * record where information came from and its licensing status (spec §10, §41).
 * Internal-only: not a public API surface.
 */
export const Sources: CollectionConfig = {
  slug: "sources",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: isAnyEditorialRole,
    create: isAnyEditorialRole,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "url",
      type: "text",
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Agencia", value: "agencia" },
        { label: "Medio", value: "medio" },
        { label: "Fuente oficial", value: "oficial" },
        { label: "Comunicado", value: "comunicado" },
        { label: "Otro", value: "otro" },
      ],
    },
    {
      name: "licenseStatus",
      type: "select",
      required: true,
      defaultValue: "pending_review",
      options: [
        { label: "Licenciada", value: "licensed" },
        { label: "Dominio público", value: "public_domain" },
        { label: "Uso legítimo con atribución", value: "fair_use_attribution" },
        { label: "Pendiente de revisión", value: "pending_review" },
        { label: "Restringida", value: "restricted" },
      ],
    },
    {
      name: "notes",
      type: "textarea",
      admin: { description: "Nota interna editorial — nunca se muestra públicamente." },
    },
    {
      name: "ingestionActive",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Si está activo, el motor de ingestión de noticias consulta feedUrl periódicamente. Actívalo solo para feeds que ya revisaste (ver licenseStatus) — el motor nunca copia el artículo completo, solo usa título/resumen como radar de tendencias.",
      },
    },
    {
      name: "feedUrl",
      type: "text",
      admin: {
        description: "URL del feed RSS/Atom, solo relevante si ingestionActive está activo.",
        condition: (_, siblingData) => Boolean(siblingData?.ingestionActive),
      },
    },
    {
      name: "categoryHint",
      type: "relationship",
      relationTo: "categories",
      admin: {
        description: "Categoría sugerida por defecto para los ítems de este feed (el clasificador por palabras clave puede anularla).",
        condition: (_, siblingData) => Boolean(siblingData?.ingestionActive),
      },
    },
  ],
};
