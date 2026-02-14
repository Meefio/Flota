"use client";

import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createNote, toggleNote, deleteNote } from "@/lib/actions/notes";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Note {
  id: number;
  content: string;
  isDone: boolean;
  createdByName: string;
  createdAt: Date;
}

interface VehicleNotesProps {
  vehicleId: number;
  notes: Note[];
  readonly?: boolean;
}

export function VehicleNotes({ vehicleId, notes, readonly = false }: VehicleNotesProps) {
  return (
    <div className="space-y-3">
      {!readonly && <AddNoteForm vehicleId={vehicleId} />}

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-2">
          Brak adnotacji
        </p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <NoteItem key={note.id} note={note} readonly={readonly} />
          ))}
        </ul>
      )}
    </div>
  );
}

function AddNoteForm({ vehicleId }: { vehicleId: number }) {
  async function handleAction(_prev: unknown, formData: FormData) {
    formData.set("vehicleId", String(vehicleId));
    const result = await createNote(formData);
    if ("error" in result) {
      toast.error("Nie udało się dodać adnotacji");
      return result;
    }
    toast.success("Adnotacja dodana");
    return { success: true };
  }

  const [, formAction, isPending] = useActionState(handleAction, null);

  return (
    <form action={formAction} className="flex gap-2">
      <Input
        name="content"
        placeholder="Nowa czynność do wykonania..."
        maxLength={500}
        className="flex-1"
      />
      <Button type="submit" size="sm" disabled={isPending}>
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}

function NoteItem({ note, readonly }: { note: Note; readonly: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(checked: boolean) {
    startTransition(async () => {
      await toggleNote(note.id, checked);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteNote(note.id);
      toast.success("Adnotacja usunięta");
    });
  }

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-md border p-2 text-sm transition-opacity",
        isPending && "opacity-50",
        note.isDone && "bg-muted/50"
      )}
    >
      {!readonly && (
        <Checkbox
          checked={note.isDone}
          onCheckedChange={handleToggle}
          disabled={isPending}
        />
      )}
      <span
        className={cn(
          "flex-1",
          note.isDone && "line-through text-muted-foreground"
        )}
      >
        {note.content}
      </span>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {note.createdByName}
      </span>
      {!readonly && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </li>
  );
}
