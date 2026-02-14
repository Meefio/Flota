"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDriver, updateDriver } from "@/lib/actions/drivers";

interface DriverFormProps {
  driver?: {
    id: number;
    email: string;
    name: string;
  };
}

export function DriverForm({ driver }: DriverFormProps) {
  const router = useRouter();
  const isEditing = !!driver;

  async function handleAction(_prev: unknown, formData: FormData) {
    const result = isEditing
      ? await updateDriver(driver!.id, formData)
      : await createDriver(formData);

    if ("error" in result) return result;

    if ("driverId" in result) {
      router.push(`/admin/kierowcy/${result.driverId}`);
    } else {
      router.push(`/admin/kierowcy/${driver!.id}`);
    }
    return null;
  }

  const [state, formAction, isPending] = useActionState(handleAction, null);
  const errors = state?.error as Record<string, string[]> | undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edytuj kierowcę" : "Nowy kierowca"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Imię i nazwisko</Label>
            <Input
              name="name"
              defaultValue={driver?.name ?? ""}
              placeholder="Jan Kowalski"
            />
            {errors?.name && (
              <p className="text-sm text-destructive">{errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="email"
              defaultValue={driver?.email ?? ""}
              placeholder="jan@firma.pl"
            />
            {errors?.email && (
              <p className="text-sm text-destructive">{errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditing ? "Nowe hasło (opcjonalne)" : "Hasło"}
            </Label>
            <Input
              name="password"
              type="password"
              placeholder={isEditing ? "Zostaw puste aby nie zmieniać" : "Min. 6 znaków"}
            />
            {errors?.password && (
              <p className="text-sm text-destructive">{errors.password[0]}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Zapisywanie..."
                : isEditing
                ? "Zapisz zmiany"
                : "Dodaj kierowcę"}
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
