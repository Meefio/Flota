import { DEADLINE_TYPE_LABELS } from "@/lib/constants";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import type { DeadlineType } from "@/db/schema";
import { FileText } from "lucide-react";

interface Operation {
  id: number;
  deadlineType: string;
  performedAt: string;
  newExpiryDate: string;
  notes: string | null;
  performedByName: string;
  createdAt: Date;
  files: { id: number; fileName: string; url: string }[];
}

export function OperationHistory({ operations }: { operations: Operation[] }) {
  if (operations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Brak historii operacji
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {operations.map((op) => (
        <div key={op.id} className="border rounded-lg p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">
              {DEADLINE_TYPE_LABELS[op.deadlineType as DeadlineType] ??
                op.deadlineType}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(parseISO(op.performedAt), "dd.MM.yyyy", { locale: pl })}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Nowa data ważności:{" "}
            {format(parseISO(op.newExpiryDate), "dd.MM.yyyy", { locale: pl })}
          </p>
          <p className="text-xs text-muted-foreground">
            Wykonał: {op.performedByName}
          </p>
          {op.notes && <p className="text-sm mt-1">{op.notes}</p>}
          {op.files.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {op.files.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <FileText className="h-3 w-3" />
                  {file.fileName}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
