"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateOwnName } from "@/lib/actions/profile";

interface ProfileFormProps {
  initialName: string;
}

export function ProfileForm({ initialName }: ProfileFormProps) {
  async function handleAction(_prev: unknown, formData: FormData) {
    const result = await updateOwnName(formData);
    if ("error" in result) return result;
    return null;
  }

  const [state, formAction, isPending] = useActionState(handleAction, null);
  const errors = state?.error as Record<string, string[]> | undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moje konto</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Imię i nazwisko</Label>
            <Input
              id="name"
              name="name"
              defaultValue={initialName}
              placeholder="Jan Kowalski"
              maxLength={255}
              aria-invalid={!!errors?.name}
              aria-describedby={errors?.name ? "name-error" : undefined}
            />
            {errors?.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name[0]}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Zapisywanie..." : "Zapisz"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
