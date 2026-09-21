import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "@/access/isAdminOrEditor";
import { isAnyEditorialRole } from "@/access/isAnyEditorialRole";

/**
 * Audit trail / queue for the automated news ingestion engine (spec §5:
 * panel para auditar qué se procesó, qué está pendiente, qué falló). One
 * row per RSS item seen, regardless of outcome — dedup, category miss,
 * AI/network failure, or a successful draft.
 */
export const IngestedItems: CollectionConfig = {
  slug: "ingested-items",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "sourceFeed", "article", "processedAt"],
    description: "Registro de auditoría del motor de ingestión automática. No es contenido público.",
  },
  access: {
    read: isAnyEditorialRole,
    create: isAnyEditorialRole,
    update: isAnyEditorialRole,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: { description: "Título original tal como llegó del feed RSS." },
    },
    {
      name: "sourceFeed",
      type: "relationship",
      relationTo: "sources",
      required: true,
    },
    {
      name: "originalUrl",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "titleHash",
      type: "text",
      required: true,
      index: true,
      admin: { description: "Hash del título normalizado — detecta la misma noticia repetida entre feeds distintos." },
    },
    {
      name: "originalPublishedAt",
      type: "date",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "detected",
      options: [
        { label: "Detectado", value: "detected" },
        { label: "Redactando", value: "drafting" },
        { label: "Borrador creado", value: "drafted" },
        { label: "Duplicado (omitido)", value: "skipped_duplicate" },
        { label: "Sin categoría (omitido)", value: "skipped_no_category" },
        { label: "Falló", value: "failed" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "article",
      type: "relationship",
      relationTo: "articles",
      admin: { position: "sidebar", description: "Se completa solo si se llegó a crear un borrador." },
    },
    {
      name: "errorMessage",
      type: "textarea",
      admin: {
        description: "Detalle del fallo (cuota de IA, red, etc.) — vacío si no hubo error.",
        condition: (_, siblingData) => siblingData?.status === "failed",
      },
    },
    {
      name: "processedAt",
      type: "date",
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
    },
  ],
};
