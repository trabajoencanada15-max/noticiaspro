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
  ],
};
