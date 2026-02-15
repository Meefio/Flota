"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createUser, updateUser } from "@/lib/actions/users";

interface UserFormProps {
  user?: {
    id: number;
    email: string;
    name: string;
    role: "admin" | "driver";
  };
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const isEditing = !!user;

  async function handleAction(_prev: unknown, formData: FormData) {
    const result = isEditing
      ? await updateUser(user!.id, formData)
      : await createUser(formData);

    if ("error" in result) return result;

    if ("userId" in result) {
      router.push(`/admin/uzytkownicy/${result.userId}`);
    } else {
      router.push(`/admin/uzytkownicy/${user!.id}`);
    }
    return null;
  }

  const [state, formAction, isPending] = useActionState(handleAction, null);
  const errors = state?.error as Record<string, string[]> | undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edytuj użytkownika" : "Nowy użytkownik"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Imię i nazwisko</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user?.name ?? ""}
              placeholder="Jan Kowalski"
              aria-invalid={!!errors?.name}
            />
            {errors?.name && (
              <p className="text-sm text-destructive">{errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user?.email ?? ""}
              placeholder="jan@firma.pl"
              aria-invalid={!!errors?.email}
            />
            {errors?.email && (
              <p className="text-sm text-destructive">{errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rola</Label>
            <Select name="role" defaultValue={user?.role ?? "driver"}>
              <SelectTrigger id="role" aria-invalid={!!errors?.role}>
                <SelectValue placeholder="Wybierz rolę" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="driver">Kierowca</SelectItem>
              </SelectContent>
            </Select>
            {errors?.role && (
              <p className="text-sm text-destructive">{errors.role[0]}</p>
            )}
          </div>

          {!isEditing && (
            <p className="text-sm text-muted-foreground">
              Użytkownik otrzyma konto na podany email i przy pierwszym
              logowaniu ustawi hasło. Hasło można też zresetować w edycji
              użytkownika.
            </p>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Zapisywanie..."
                : isEditing
                  ? "Zapisz zmiany"
                  : "Dodaj użytkownika"}
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
