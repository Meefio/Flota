"use client";

import { useActionState, useTransition, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SERVICE_TYPE_LABELS } from "@/lib/constants";
import { updateService, deleteService } from "@/lib/actions/services";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import type { ServiceType } from "@/db/schema";

interface Service {
  id: number;
  type: string;
  description: string;
  performedAt: string;
  cost: string | null;
  mileage: number | null;
  workshop: string | null;
  notes: string | null;
}

export function ServiceList({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Brak wpisów serwisowych
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <ServiceItem key={service.id} service={service} />
      ))}
    </div>
  );
}

function ServiceItem({ service }: { service: Service }) {
  const [editOpen, setEditOpen] = useState(false);
  const [isDeleting, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Czy na pewno chcesz usunąć ten wpis serwisowy?")) return;
    startTransition(async () => {
      const result = await deleteService(service.id);
      if ("error" in result) {
        toast.error("Nie udało się usunąć serwisu");
      } else {
        toast.success("Serwis usunięty");
      }
    });
  }

  return (
    <>
      <div className={`border rounded-lg p-3 space-y-1 ${isDeleting ? "opacity-50" : ""}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Badge variant="outline">
              {SERVICE_TYPE_LABELS[service.type as ServiceType] ?? service.type}
            </Badge>
            <span className="text-sm font-medium truncate">{service.description}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {service.cost && (
              <span className="text-sm font-semibold mr-2">
                {Number(service.cost).toLocaleString("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                })}
              </span>
            )}
            <Button variant="ghost" size="icon-xs" onClick={() => setEditOpen(true)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Data: {new Date(service.performedAt).toLocaleDateString("pl-PL")}</span>
          {service.mileage && (
            <span>Przebieg: {service.mileage.toLocaleString("pl-PL")} km</span>
          )}
          {service.workshop && <span>Warsztat: {service.workshop}</span>}
        </div>
        {service.notes && (
          <p className="text-xs text-muted-foreground mt-1">{service.notes}</p>
        )}
      </div>

      <EditServiceDialog
        service={service}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

function EditServiceDialog({
  service,
  open,
  onOpenChange,
}: {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  async function handleAction(_prev: unknown, formData: FormData) {
    const result = await updateService(service.id, formData);
    if ("error" in result) {
      return result;
    }
    toast.success("Serwis zaktualizowany");
    onOpenChange(false);
    return { success: true };
  }

  const [state, formAction, isPending] = useActionState(handleAction, null);
  const errors =
    state && "error" in state
      ? (state.error as Record<string, string[]>)
      : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj wpis serwisowy</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label>Typ serwisu</Label>
            <Select name="type" defaultValue={service.type}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz typ" />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(SERVICE_TYPE_LABELS) as [ServiceType, string][]).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {errors?.type && (
              <p className="text-sm text-destructive">{errors.type[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Opis</Label>
            <Input
              name="description"
              defaultValue={service.description}
              placeholder="np. Wymiana oleju silnikowego + filtr"
            />
            {errors?.description && (
              <p className="text-sm text-destructive">{errors.description[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data wykonania</Label>
              <Input name="performedAt" type="date" defaultValue={service.performedAt} />
              {errors?.performedAt && (
                <p className="text-sm text-destructive">{errors.performedAt[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Koszt (PLN)</Label>
              <Input
                name="cost"
                type="number"
                step="0.01"
                min="0"
                defaultValue={service.cost ?? ""}
                placeholder="0.00"
              />
              {errors?.cost && (
                <p className="text-sm text-destructive">{errors.cost[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Przebieg (km)</Label>
              <Input
                name="mileage"
                type="number"
                min="0"
                defaultValue={service.mileage ?? ""}
                placeholder="np. 150000"
              />
            </div>

            <div className="space-y-2">
              <Label>Warsztat</Label>
              <Input
                name="workshop"
                defaultValue={service.workshop ?? ""}
                placeholder="np. Auto-Serwis Sp. z o.o."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notatki</Label>
            <Textarea
              name="notes"
              defaultValue={service.notes ?? ""}
              placeholder="Dodatkowe informacje..."
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Zapisywanie..." : "Zapisz zmiany"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
