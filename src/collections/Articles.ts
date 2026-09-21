import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "@/access/isAdminOrEditor";
import { isAdminOrEditorOrAuthor } from "@/access/isAdminOrEditorOrAuthor";
import { canUpdateArticle } from "@/access/canUpdateArticle";
import { publishedOnly } from "@/access/publishedOnly";
import { slugField } from "@/fields/slug";
import { seoField } from "@/fields/seo";
import { computeReadingTime } from "@/hooks/computeReadingTime";
import { trackArticleUpdates } from "@/hooks/trackArticleUpdates";
import {
  revalidateArticleAfterChange,
  revalidateArticleAfterDelete,
} from "@/hooks/revalidateArticle";

const STAFF_ONLY_STATUSES = ["scheduled", "published", "updated", "retracted", "archived"];

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "category", "author", "publishedAt"],
  },
  access: {
    read: publishedOnly,
    create: isAdminOrEditorOrAuthor,
    update: canUpdateArticle,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [computeReadingTime, trackArticleUpdates],
    afterChange: [revalidateArticleAfterChange],
    afterDelete: [revalidateArticleAfterDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    slugField("title"),
    {
      name: "subtitle",
      type: "text",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Borrador", value: "draft" },
        { label: "En revisión", value: "in_review" },
        { label: "Programado", value: "scheduled" },
        { label: "Publicado", value: "published" },
        { label: "Actualizado", value: "updated" },
        { label: "Retractado", value: "retracted" },
        { label: "Archivado", value: "archived" },
      ],
      admin: { position: "sidebar" },
      access: {
        create: ({ req: { user }, data }) => {
          if (user?.roles?.includes("admin") || user?.roles?.includes("editor")) return true;
          return !data?.status || !STAFF_ONLY_STATUSES.includes(data.status);
        },
        update: ({ req: { user }, data }) => {
          if (user?.roles?.includes("admin") || user?.roles?.includes("editor")) return true;
          return !data?.status || !STAFF_ONLY_STATUSES.includes(data.status);
        },
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
      validate: (value, { data }) => {
        const status = (data as { status?: string } | undefined)?.status;
        const needsIt = ["published", "updated"].includes(String(status));
        if (needsIt && !value) {
          return "La fecha de publicación es obligatoria para artículos publicados o actualizados.";
        }
        return true;
      },
    },
    {
      name: "scheduledAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
        condition: (data) => data?.status === "scheduled",
      },
      validate: (value, { data }) => {
        const status = (data as { status?: string } | undefined)?.status;
        if (status === "scheduled" && !value) {
          return 'La fecha de programación es obligatoria cuando el estado es "Programado".';
        }
        return true;
      },
    },
    {
      name: "lastUpdatedAt",
      type: "date",
      admin: {
        position: "sidebar",
        readOnly: true,
        date: { pickerAppearance: "dayAndTime" },
        description: "Se actualiza automáticamente al editar un artículo publicado.",
      },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      required: true,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    {
      name: "region",
      type: "relationship",
      relationTo: "regions",
      admin: {
        description: "Edición/región geográfica (opcional) — independiente de la categoría temática.",
      },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "featuredImage",
      type: "relationship",
      relationTo: "media",
      required: true,
    },
    {
      name: "imageCaption",
      type: "text",
    },
    {
      name: "imageCredit",
      type: "text",
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      admin: { description: "Usado en tarjetas y como meta description por defecto." },
    },
    {
      name: "body",
      type: "richText",
      required: true,
    },
    {
      name: "readingTime",
      type: "number",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Minutos de lectura, calculados automáticamente.",
      },
    },
    {
      name: "priority",
      type: "select",
      defaultValue: "standard",
      options: [
        { label: "Última hora (breaking)", value: "breaking" },
        { label: "Destacada", value: "featured" },
        { label: "Estándar", value: "standard" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "viewCount",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Incrementado por el sitio público en cada vista; alimenta 'Más leídas'.",
      },
    },
    {
      name: "aiGenerated",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Borrador inicial generado por el motor de ingestión automática — ver política editorial.",
      },
    },
    {
      name: "sourceReferences",
      type: "array",
      label: "Fuentes consultadas",
      fields: [
        { name: "source", type: "relationship", relationTo: "sources" },
        { name: "note", type: "text" },
        { name: "url", type: "text" },
      ],
    },
    {
      name: "correction",
      type: "group",
      label: "Corrección",
      fields: [
        { name: "hasCorrection", type: "checkbox", defaultValue: false },
        {
          name: "correctionNote",
          type: "textarea",
          admin: { condition: (_, siblingData) => Boolean(siblingData?.hasCorrection) },
        },
        {
          name: "correctedAt",
          type: "date",
          admin: { condition: (_, siblingData) => Boolean(siblingData?.hasCorrection) },
        },
      ],
    },
    seoField,
  ],
};
