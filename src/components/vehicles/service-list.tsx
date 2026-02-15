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
import { Card, CardContent } from "@/components/ui/card";
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
      <Card className={isDeleting ? "opacity-50" : undefined}>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {SERVICE_TYPE_LABELS[service.type as ServiceType] ?? service.type}
                </Badge>
                <span className="text-base font-medium leading-tight">
                  {service.description}
                </span>
              </div>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-muted-foreground font-normal">Data</dt>
                  <dd className="font-medium">
                    {new Date(service.performedAt).toLocaleDateString("pl-PL")}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-normal">Przebieg</dt>
                  <dd className="font-medium">
                    {service.mileage != null
                      ? `${service.mileage.toLocaleString("pl-PL")} km`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-normal">Warsztat</dt>
                  <dd className="font-medium truncate" title={service.workshop ?? undefined}>
                    {service.workshop ?? "—"}
                  </dd>
                </div>
              </dl>
              {service.notes && (
                <div>
                  <p className="text-muted-foreground text-sm font-normal">Notatki</p>
                  <p className="text-sm mt-0.5">{service.notes}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0 sm:flex-col sm:items-end">
              {service.cost && (
                <span className="text-base font-semibold tabular-nums">
                  {Number(service.cost).toLocaleString("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  })}
                </span>
              )}
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditOpen(true)}
                  aria-label="Edytuj serwis"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  aria-label="Usuń serwis"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
