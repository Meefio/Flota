"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { resetDriverPassword } from "@/lib/actions/drivers";
import { KeyRound } from "lucide-react";

interface ResetPasswordButtonProps {
  driverId: number;
}

export function ResetPasswordButton({ driverId }: ResetPasswordButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleReset = async () => {
    setIsPending(true);
    const result = await resetDriverPassword(driverId);
    setIsPending(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success(
      "Hasło zresetowane. Kierowca przy następnym logowaniu ustawi nowe hasło."
    );
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" aria-label="Resetuj hasło">
          <KeyRound className="h-4 w-4 mr-2" />
          Resetuj hasło
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resetuj hasło</DialogTitle>
          <DialogDescription>
            Kierowca przy następnym logowaniu będzie musiał ustawić nowe hasło.
            Kontynuować?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Anuluj
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Resetowanie..." : "Resetuj hasło"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
