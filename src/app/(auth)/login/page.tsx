"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkLoginEmail, setPasswordAndLogin } from "@/lib/actions/auth";

type LoginStep = "email" | "password" | "set_password";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const value = ((formData.get("email") as string) ?? "").trim();
    if (!value) {
      setLoading(false);
      return;
    }
    const result = await checkLoginEmail(value);
    setLoading(false);
    if (!result.ok) {
      setError("Nieprawidłowy email lub konto nieaktywne");
      return;
    }
    setEmail(value);
    setStep(result.mustSetPassword ? "set_password" : "password");
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Nieprawidłowy email lub hasło");
      return;
    }
    router.push("/");
    router.refresh();
  };

  const handleSetPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const password = (formData.get("newPassword") as string) ?? "";
    const confirmPassword = (formData.get("confirmPassword") as string) ?? "";
    const result = await setPasswordAndLogin(email, password, confirmPassword);
    if ("error" in result) {
      setError(result.error ?? "Wystąpił błąd");
      setLoading(false);
      return;
    }
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (signInResult?.error) {
      setError("Hasło ustawione. Zaloguj się ponownie.");
      setStep("password");
      return;
    }
    router.push("/");
    router.refresh();
  };

  const handleBack = () => {
    setStep("email");
    setError("");
    setEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="sr-only">Logowanie do systemu floty</CardTitle>
          <div className="flex justify-center items-center mb-4">
            <Image
              src="/logo.png"
              alt="W.G. Invest Group Sp. z o.o."
              width={380}
              height={104}
              className="h-24 w-auto max-w-full object-contain"
              priority
              unoptimized
            />
          </div>
          <p className="text-muted-foreground text-sm">
            Zarządzanie flotą pojazdów
          </p>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@firma.pl"
                  required
                  autoComplete="email"
                  aria-invalid={!!error}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sprawdzanie..." : "Dalej"}
              </Button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground wrap-break-word">
                {email}
              </p>
              <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  aria-invalid={!!error}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logowanie..." : "Zaloguj się"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleBack}
                disabled={loading}
              >
                Wróć
              </Button>
            </form>
          )}

          {step === "set_password" && (
            <form onSubmit={handleSetPasswordSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground wrap-break-word">
                {email}
              </p>
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
                  aria-invalid={!!error}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Powtórz hasło"
                  aria-invalid={!!error}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Zapisywanie..." : "Ustaw hasło i zaloguj"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleBack}
                disabled={loading}
              >
                Wróć
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
