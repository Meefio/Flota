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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICE_TYPE_LABELS } from "@/lib/constants";
import {
  createPlannedService,
  updatePlannedService,
  deletePlannedService,
} from "@/lib/actions/planned-services";
import { toast } from "sonner";
import { CalendarPlus, Pencil, Trash2 } from "lucide-react";
import type { ServiceType } from "@/db/schema";

interface PlannedService {
  id: number;
  type: string;
  plannedDate: string;
  notes: string | null;
  createdAt: Date;
}

interface PlannedServiceListProps {
  vehicleId: number;
  plannedServices: PlannedService[];
}

export function PlannedServiceList({
  vehicleId,
  plannedServices,
}: PlannedServiceListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          Zaplanowane daty kolejnych serwisów (widoczne w kalendarzu).
        </span>
        <PlannedServiceForm vehicleId={vehicleId} />
      </div>
      {plannedServices.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Brak zaplanowanych serwisów. Kliknij „Zaplanuj serwis”, aby dodać datę.
        </p>
      ) : (
        <div className="space-y-3">
          {plannedServices.map((planned) => (
            <PlannedServiceItem
              key={planned.id}
              vehicleId={vehicleId}
              planned={planned}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PlannedServiceForm({ vehicleId }: { vehicleId: number }) {
  async function handleAction(_prev: unknown, formData: FormData) {
    formData.set("vehicleId", String(vehicleId));
    const result = await createPlannedService(formData);
    if ("error" in result) {
      return result;
    }
    toast.success("Zaplanowano serwis");
    return { success: true };
  }

  const [state, formAction, isPending] = useActionState(handleAction, null);
  const errors =
    state && "error" in state
      ? (state.error as Record<string, string[]>)
      : undefined;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" aria-label="Zaplanuj kolejny serwis">
          <CalendarPlus className="h-4 w-4 mr-2" />
          Zaplanuj serwis
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zaplanuj kolejny serwis</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planned-type">Typ serwisu</Label>
            <Select name="type" required>
              <SelectTrigger id="planned-type">
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
            <Label htmlFor="planned-date">Planowana data</Label>
            <Input
              id="planned-date"
              name="plannedDate"
              type="date"
              required
              aria-required="true"
            />
            {errors?.plannedDate && (
              <p className="text-sm text-destructive">{errors.plannedDate[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="planned-notes">Notatki (opcjonalnie)</Label>
            <Textarea
              id="planned-notes"
              name="notes"
              placeholder="np. Wymiana oleju co 15 000 km"
              rows={2}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Zapisywanie..." : "Zapisz"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PlannedServiceItem({
  vehicleId,
  planned,
}: {
  vehicleId: number;
  planned: PlannedService;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [isDeleting, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Czy na pewno chcesz usunąć ten zaplanowany serwis?")) return;
    startTransition(async () => {
      const result = await deletePlannedService(planned.id);
      if ("error" in result) {
        toast.error("Nie udało się usunąć zaplanowanego serwisu");
      } else {
        toast.success("Zaplanowany serwis usunięty");
      }
    });
  };

  return (
    <>
      <Card className={isDeleting ? "opacity-50" : undefined}>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {SERVICE_TYPE_LABELS[planned.type as ServiceType] ?? planned.type}
                </Badge>
                <span className="text-sm font-medium">
                  {new Date(planned.plannedDate).toLocaleDateString("pl-PL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              {planned.notes && (
                <p className="text-sm text-muted-foreground">{planned.notes}</p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditOpen(true)}
                aria-label="Edytuj zaplanowany serwis"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                aria-label="Usuń zaplanowany serwis"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditPlannedServiceDialog
        vehicleId={vehicleId}
        planned={planned}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

function EditPlannedServiceDialog({
  vehicleId,
  planned,
  open,
  onOpenChange,
}: {
  vehicleId: number;
  planned: PlannedService;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  async function handleAction(_prev: unknown, formData: FormData) {
    formData.set("vehicleId", String(vehicleId));
    const result = await updatePlannedService(planned.id, formData);
    if ("error" in result) {
      return result;
    }
    toast.success("Zaplanowany serwis zaktualizowany");
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
          <DialogTitle>Edytuj zaplanowany serwis</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input
            type="hidden"
            name="vehicleId"
            value={vehicleId}
            readOnly
            aria-hidden
          />
          <div className="space-y-2">
            <Label htmlFor="edit-planned-type">Typ serwisu</Label>
            <Select name="type" defaultValue={planned.type}>
              <SelectTrigger id="edit-planned-type">
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
            <Label htmlFor="edit-planned-date">Planowana data</Label>
            <Input
              id="edit-planned-date"
              name="plannedDate"
              type="date"
              defaultValue={planned.plannedDate}
              required
            />
            {errors?.plannedDate && (
              <p className="text-sm text-destructive">{errors.plannedDate[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-planned-notes">Notatki</Label>
            <Textarea
              id="edit-planned-notes"
              name="notes"
              defaultValue={planned.notes ?? ""}
              placeholder="Opcjonalnie"
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
