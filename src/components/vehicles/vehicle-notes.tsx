"use client";

import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createNote, toggleNote, deleteNote } from "@/lib/actions/notes";
import { toast } from "sonner";
import { Plus, Trash2, Shield, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Note {
  id: number;
  content: string;
  isDone: boolean;
  assignedToId: number | null;
  isAdminOnly: boolean;
  createdByName: string;
  assignedToName: string | null;
  createdAt: Date;
}

interface Driver {
  id: number;
  name: string;
}

interface VehicleNotesProps {
  vehicleId: number;
  notes: Note[];
  readonly?: boolean;
  drivers?: Driver[];
}

export function VehicleNotes({
  vehicleId,
  notes,
  readonly = false,
  drivers,
}: VehicleNotesProps) {
  return (
    <div className="space-y-3">
      {!readonly && (
        <AddNoteForm vehicleId={vehicleId} drivers={drivers} />
      )}

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-2">
          Brak adnotacji
        </p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              readonly={readonly}
              showVisibility={!!drivers}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function AddNoteForm({
  vehicleId,
  drivers,
}: {
  vehicleId: number;
  drivers?: Driver[];
}) {
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
    <form action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <Input
          name="content"
          placeholder="Nowa czynność do wykonania..."
          maxLength={500}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={isPending}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {drivers && drivers.length > 0 && (
        <Select name="assignedToId">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Przypisz do kierowcy (opcjonalnie)" />
          </SelectTrigger>
          <SelectContent>
            {drivers.map((driver) => (
              <SelectItem key={driver.id} value={String(driver.id)}>
                {driver.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </form>
  );
}

function NoteItem({
  note,
  readonly,
  showVisibility,
}: {
  note: Note;
  readonly: boolean;
  showVisibility: boolean;
}) {
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
      <div className="flex items-center gap-1.5 shrink-0">
        {showVisibility && note.isAdminOnly && (
          <Badge variant="outline" className="text-xs gap-1 px-1.5">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        )}
        {note.assignedToName && (
          <Badge variant="secondary" className="text-xs gap-1 px-1.5">
            <UserCheck className="h-3 w-3" />
            {note.assignedToName}
          </Badge>
        )}
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
      </div>
    </li>
  );
}
