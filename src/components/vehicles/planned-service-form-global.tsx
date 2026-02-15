"use client";

import { useActionState } from "react";
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
import { SERVICE_TYPE_LABELS } from "@/lib/constants";
import { createPlannedService } from "@/lib/actions/planned-services";
import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";
import type { ServiceType } from "@/db/schema";

interface PlannedServiceFormGlobalProps {
  vehicles: { id: number; registrationNumber: string; brand: string; model: string }[];
}

export function PlannedServiceFormGlobal({ vehicles }: PlannedServiceFormGlobalProps) {
  async function handleAction(_prev: unknown, formData: FormData) {
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
        <Button size="sm" variant="outline" className="sm:h-9 sm:px-4 sm:py-2">
          <CalendarPlus className="h-3.5 w-3 mr-1.5 sm:h-4 sm:mr-2" />
          Zaplanuj serwis
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zaplanuj serwis</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label>Pojazd</Label>
            <Select name="vehicleId">
              <SelectTrigger>
                <SelectValue placeholder="Wybierz pojazd" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.registrationNumber} — {v.brand} {v.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.vehicleId && (
              <p className="text-sm text-destructive">{errors.vehicleId[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Typ serwisu</Label>
            <Select name="type">
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
            <Label>Planowana data</Label>
            <Input name="plannedDate" type="date" required />
            {errors?.plannedDate && (
              <p className="text-sm text-destructive">{errors.plannedDate[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Notatki (opcjonalnie)</Label>
            <Textarea
              name="notes"
              placeholder="np. Wymiana oleju co 15 000 km"
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Zapisywanie..." : "Zaplanuj serwis"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
