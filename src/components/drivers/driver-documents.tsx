"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DRIVER_DOCUMENT_LABELS,
  AUTHORIZATION_DOCUMENTS,
  EXPIRY_DOCUMENTS,
} from "@/lib/constants";
import { DeadlineBadge } from "@/components/vehicles/deadline-badge";
import {
  updateDriverDocument,
  toggleAuthorization,
} from "@/lib/actions/driver-documents";
import { toast } from "sonner";
import type { DriverDocumentType } from "@/db/schema";

interface Document {
  id: number;
  userId: number;
  type: string;
  expiresAt: string | null;
  isActive: boolean;
}

interface DriverDocumentsProps {
  userId: number;
  documents: Document[];
}

export function DriverDocuments({ userId, documents }: DriverDocumentsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Dokumenty z terminem ważności</h3>
        <div className="space-y-3">
          {EXPIRY_DOCUMENTS.map((type) => {
            const doc = documents.find((d) => d.type === type);
            return (
              <ExpiryDocumentRow
                key={type}
                userId={userId}
                type={type}
                expiresAt={doc?.expiresAt ?? null}
              />
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Upoważnienia</h3>
        <div className="space-y-3">
          {AUTHORIZATION_DOCUMENTS.map((type) => {
            const doc = documents.find((d) => d.type === type);
            return (
              <AuthorizationRow
                key={type}
                userId={userId}
                type={type}
                isActive={doc?.isActive ?? false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ExpiryDocumentRow({
  userId,
  type,
  expiresAt,
}: {
  userId: number;
  type: DriverDocumentType;
  expiresAt: string | null;
}) {
  const [date, setDate] = useState(expiresAt ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateDriverDocument(userId, type, {
      expiresAt: date || null,
    });
    toast.success("Zaktualizowano dokument");
    setSaving(false);
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b last:border-0">
      <Label className="min-w-[140px] text-sm">
        {DRIVER_DOCUMENT_LABELS[type]}
      </Label>
      <div className="flex items-center gap-2">
        {expiresAt && <DeadlineBadge expiresAt={expiresAt} />}
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-40"
        />
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "..." : "Zapisz"}
        </Button>
      </div>
    </div>
  );
}

function AuthorizationRow({
  userId,
  type,
  isActive,
}: {
  userId: number;
  type: DriverDocumentType;
  isActive: boolean;
}) {
  const [checked, setChecked] = useState(isActive);
  const [saving, setSaving] = useState(false);

  async function handleToggle(value: boolean) {
    setSaving(true);
    setChecked(value);
    await toggleAuthorization(userId, type, value);
    toast.success(value ? "Upoważnienie aktywowane" : "Upoważnienie dezaktywowane");
    setSaving(false);
  }

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <Label className="text-sm">{DRIVER_DOCUMENT_LABELS[type]}</Label>
      <Switch
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={saving}
      />
    </div>
  );
}
