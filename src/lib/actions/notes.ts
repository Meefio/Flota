"use server";

import { db } from "@/db";
import { vehicleNotes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireDriverOwnership } from "@/lib/auth-utils";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const noteSchema = z.object({
  vehicleId: z.coerce.number().positive(),
  content: z.string().min(1, "Treść jest wymagana").max(500),
});

export async function createNote(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = noteSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const session = await requireDriverOwnership(parsed.data.vehicleId);

  const [note] = await db
    .insert(vehicleNotes)
    .values({
      vehicleId: parsed.data.vehicleId,
      content: parsed.data.content,
      createdById: Number(session.user.id),
    })
    .returning();

  if (note) {
    const contentPreview =
      parsed.data.content.length > 80
        ? `${parsed.data.content.slice(0, 80)}…`
        : parsed.data.content;
    await logAudit({
      userId: Number(session.user.id),
      action: "note.create",
      entityType: "vehicle_note",
      entityId: note.id,
      details: { vehicleId: parsed.data.vehicleId, contentPreview },
    });
  }

  revalidatePath(`/kierowca/pojazdy/${parsed.data.vehicleId}`);
  revalidatePath(`/admin/pojazdy/${parsed.data.vehicleId}`);
  return { success: true };
}

export async function toggleNote(noteId: number, isDone: boolean) {
  const [note] = await db
    .select({ vehicleId: vehicleNotes.vehicleId })
    .from(vehicleNotes)
    .where(eq(vehicleNotes.id, noteId))
    .limit(1);

  if (!note) return { error: "Nie znaleziono notatki" };

  const session = await requireDriverOwnership(note.vehicleId);

  await db
    .update(vehicleNotes)
    .set({ isDone, updatedAt: new Date() })
    .where(eq(vehicleNotes.id, noteId));

  await logAudit({
    userId: Number(session.user.id),
    action: "note.toggle",
    entityType: "vehicle_note",
    entityId: noteId,
    details: { vehicleId: note.vehicleId, isDone },
  });

  revalidatePath(`/kierowca/pojazdy/${note.vehicleId}`);
  revalidatePath(`/admin/pojazdy/${note.vehicleId}`);
  return { success: true };
}

export async function deleteNote(noteId: number) {
  const [note] = await db
    .select({ vehicleId: vehicleNotes.vehicleId })
    .from(vehicleNotes)
    .where(eq(vehicleNotes.id, noteId))
    .limit(1);

  if (!note) return { error: "Nie znaleziono notatki" };

  const session = await requireDriverOwnership(note.vehicleId);

  await db.delete(vehicleNotes).where(eq(vehicleNotes.id, noteId));

  await logAudit({
    userId: Number(session.user.id),
    action: "note.delete",
    entityType: "vehicle_note",
    entityId: noteId,
    details: { vehicleId: note.vehicleId },
  });

  revalidatePath(`/kierowca/pojazdy/${note.vehicleId}`);
  revalidatePath(`/admin/pojazdy/${note.vehicleId}`);
  return { success: true };
}
