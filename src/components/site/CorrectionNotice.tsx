import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { formatPublishedDate } from "@/lib/format";
import type { ArticleDetail } from "@/lib/types";

export function CorrectionNotice({ correction }: { correction: ArticleDetail["correction"] }) {
  if (!correction.hasCorrection) return null;

  return (
    <Alert className="border-warning-correction/40 bg-warning-correction/10">
      <AlertTitle className="text-warning-correction-foreground">
        Corrección{correction.correctedAt ? ` · ${formatPublishedDate(correction.correctedAt)}` : ""}
      </AlertTitle>
      {correction.correctionNote && <AlertDescription>{correction.correctionNote}</AlertDescription>}
    </Alert>
  );
}
