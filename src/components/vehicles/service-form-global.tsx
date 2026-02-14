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
import { createService } from "@/lib/actions/services";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { ServiceType } from "@/db/schema";

interface ServiceFormGlobalProps {
  vehicles: { id: number; registrationNumber: string }[];
}

export function ServiceFormGlobal({ vehicles }: ServiceFormGlobalProps) {
  async function handleAction(_prev: unknown, formData: FormData) {
    const result = await createService(formData);
    if ("error" in result) {
      return result;
    }
    toast.success("Serwis został zapisany");
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nowy serwis
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj wpis serwisowy</DialogTitle>
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
                    {v.registrationNumber}
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
            <Label>Opis</Label>
            <Input name="description" placeholder="np. Wymiana oleju silnikowego + filtr" />
            {errors?.description && (
              <p className="text-sm text-destructive">{errors.description[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data wykonania</Label>
              <Input name="performedAt" type="date" />
              {errors?.performedAt && (
                <p className="text-sm text-destructive">{errors.performedAt[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Koszt (PLN)</Label>
              <Input name="cost" type="number" step="0.01" min="0" placeholder="0.00" />
              {errors?.cost && (
                <p className="text-sm text-destructive">{errors.cost[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Przebieg (km)</Label>
              <Input name="mileage" type="number" min="0" placeholder="np. 150000" />
            </div>

            <div className="space-y-2">
              <Label>Warsztat</Label>
              <Input name="workshop" placeholder="np. Auto-Serwis Sp. z o.o." />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notatki</Label>
            <Textarea name="notes" placeholder="Dodatkowe informacje..." rows={2} />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Zapisywanie..." : "Zapisz serwis"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
