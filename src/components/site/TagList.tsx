import { Badge } from "@/components/ui/badge";
import type { TagSummary } from "@/lib/types";

export function TagList({ tags }: { tags: TagSummary[] }) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Etiquetas">
      {tags.map((tag) => (
        <li key={tag.id}>
          <Badge variant="outline">{tag.name}</Badge>
        </li>
      ))}
    </ul>
  );
}
