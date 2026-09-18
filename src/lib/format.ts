const dateFormatter = new Intl.DateTimeFormat("es-DO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function formatPublishedDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return dateFormatter.format(new Date(iso));
}

export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "hace un momento";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `hace ${diffHours} h`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `hace ${diffDays} d`;
  return formatPublishedDate(iso);
}

export function formatReadingTime(minutes: number | null | undefined): string {
  if (!minutes) return "";
  return `${minutes} min de lectura`;
}
