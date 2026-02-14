"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  deadlineOperationId?: number;
  driverDocumentId?: number;
  onUploaded?: (file: { id: number; url: string; fileName: string }) => void;
}

export function FileUpload({
  deadlineOperationId,
  driverDocumentId,
  onUploaded,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { id: number; url: string; fileName: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (deadlineOperationId)
      formData.append("deadlineOperationId", String(deadlineOperationId));
    if (driverDocumentId)
      formData.append("driverDocumentId", String(driverDocumentId));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Błąd uploadu");
        return;
      }

      const data = await res.json();
      setUploadedFiles((prev) => [...prev, data]);
      onUploaded?.(data);
      toast.success("Plik został przesłany");
    } catch {
      toast.error("Błąd podczas przesyłania pliku");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleUpload}
          accept="image/*,.pdf,.doc,.docx"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Przesyłanie..." : "Dodaj plik"}
        </Button>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="space-y-1">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <FileText className="h-3 w-3" />
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {file.fileName}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
