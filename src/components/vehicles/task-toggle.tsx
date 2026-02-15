"use client";

import { useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleNote } from "@/lib/actions/notes";

interface TaskToggleProps {
  noteId: number;
  isDone: boolean;
}

export function TaskToggle({ noteId, isDone }: TaskToggleProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(checked: boolean) {
    startTransition(async () => {
      await toggleNote(noteId, checked);
    });
  }

  return (
    <Checkbox
      checked={isDone}
      onCheckedChange={handleToggle}
      disabled={isPending}
      className="mt-0.5"
    />
  );
}
