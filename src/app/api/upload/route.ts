import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { fileAttachments } from "@/db/schema";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const deadlineOperationId = formData.get("deadlineOperationId") as string | null;
  const driverDocumentId = formData.get("driverDocumentId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Plik jest zbyt duży (max 10MB)" },
      { status: 400 }
    );
  }

  const blob = await put(`flota/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  const [attachment] = await db
    .insert(fileAttachments)
    .values({
      url: blob.url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      deadlineOperationId: deadlineOperationId
        ? Number(deadlineOperationId)
        : null,
      driverDocumentId: driverDocumentId ? Number(driverDocumentId) : null,
      uploadedById: Number(session.user.id),
    })
    .returning();

  return NextResponse.json(attachment);
}
