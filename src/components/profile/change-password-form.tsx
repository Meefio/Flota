"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateOwnPassword } from "@/lib/actions/profile";

export function ChangePasswordForm() {
  async function handleAction(_prev: unknown, formData: FormData) {
    const result = await updateOwnPassword(formData);
    return result;
  }

  const [state, formAction, isPending] = useActionState(handleAction, null);
  const errors = state && "error" in state ? state.error : undefined;
  const success = state && "success" in state && state.success;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zmiana hasła</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Obecne hasło</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              aria-invalid={!!errors?.currentPassword}
              aria-describedby={
                errors?.currentPassword ? "currentPassword-error" : undefined
              }
            />
            {errors?.currentPassword && (
              <p
                id="currentPassword-error"
                className="text-sm text-destructive"
              >
                {errors.currentPassword[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nowe hasło</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Min. 6 znaków"
              aria-invalid={!!errors?.newPassword}
              aria-describedby={
                errors?.newPassword ? "newPassword-error" : undefined
              }
            />
            {errors?.newPassword && (
              <p id="newPassword-error" className="text-sm text-destructive">
                {errors.newPassword[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              aria-invalid={!!errors?.confirmPassword}
              aria-describedby={
                errors?.confirmPassword ? "confirmPassword-error" : undefined
              }
            />
            {errors?.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="text-sm text-destructive"
              >
                {errors.confirmPassword[0]}
              </p>
            )}
          </div>
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Hasło zostało zmienione.
            </p>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Zapisywanie..." : "Zmień hasło"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
