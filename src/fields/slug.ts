import type { Field } from "payload";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents (á, ñ, é...)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

/** Unique, URL-safe slug auto-derived from `sourceField` when left blank. */
export const slugField = (sourceField = "title"): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
  },
  hooks: {
    beforeValidate: [
      ({ value, data, originalDoc }) => {
        if (typeof value === "string" && value.trim().length > 0) {
          return slugify(value);
        }
        const source = data?.[sourceField] ?? originalDoc?.[sourceField];
        return typeof source === "string" ? slugify(source) : value;
      },
    ],
  },
});
