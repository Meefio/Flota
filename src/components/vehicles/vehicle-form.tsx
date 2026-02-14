"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createVehicle, updateVehicle } from "@/lib/actions/vehicles";

interface VehicleFormProps {
  vehicle?: {
    id: number;
    type: string;
    registrationNumber: string;
    vin: string | null;
    brand: string;
    model: string;
    year: number | null;
    notes: string | null;
  };
}

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter();
  const isEditing = !!vehicle;

  async function handleAction(_prev: unknown, formData: FormData) {
    const result = isEditing
      ? await updateVehicle(vehicle!.id, formData)
      : await createVehicle(formData);

    if ("error" in result) {
      return result;
    }

    if ("vehicleId" in result) {
      router.push(`/admin/pojazdy/${result.vehicleId}`);
    } else {
      router.push(`/admin/pojazdy/${vehicle!.id}`);
    }
    return null;
  }

  const [state, formAction, isPending] = useActionState(handleAction, null);
  const errors = state?.error as Record<string, string[]> | undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edytuj pojazd" : "Nowy pojazd"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Typ pojazdu</Label>
              <Select name="type" defaultValue={vehicle?.type ?? ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="truck">Ciągnik</SelectItem>
                  <SelectItem value="trailer">Naczepa</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="other">Pozostałe</SelectItem>
                </SelectContent>
              </Select>
              {errors?.type && (
                <p className="text-sm text-destructive">{errors.type[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Numer rejestracyjny</Label>
              <Input
                name="registrationNumber"
                defaultValue={vehicle?.registrationNumber ?? ""}
                placeholder="np. WGM 12345"
              />
              {errors?.registrationNumber && (
                <p className="text-sm text-destructive">
                  {errors.registrationNumber[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vin">Numer VIN</Label>
              <Input
                name="vin"
                defaultValue={vehicle?.vin ?? ""}
                placeholder="np. WF0XXXGCDX1234567"
                maxLength={17}
              />
              {errors?.vin && (
                <p className="text-sm text-destructive">{errors.vin[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marka</Label>
              <Input
                name="brand"
                defaultValue={vehicle?.brand ?? ""}
                placeholder="np. Volvo"
              />
              {errors?.brand && (
                <p className="text-sm text-destructive">{errors.brand[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                name="model"
                defaultValue={vehicle?.model ?? ""}
                placeholder="np. FH 500"
              />
              {errors?.model && (
                <p className="text-sm text-destructive">{errors.model[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Rok produkcji</Label>
              <Input
                name="year"
                type="number"
                defaultValue={vehicle?.year ?? ""}
                placeholder="np. 2022"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notatki</Label>
            <Textarea
              name="notes"
              defaultValue={vehicle?.notes ?? ""}
              placeholder="Dodatkowe informacje..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Zapisywanie..."
                : isEditing
                ? "Zapisz zmiany"
                : "Dodaj pojazd"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Anuluj
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
