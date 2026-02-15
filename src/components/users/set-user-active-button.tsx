"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setUserActive } from "@/lib/actions/users";
import { toast } from "sonner";

interface SetUserActiveButtonProps {
  userId: number;
  isActive: boolean;
  currentUserId: number;
}

export function SetUserActiveButton({
  userId,
  isActive,
  currentUserId,
}: SetUserActiveButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const isSelf = userId === currentUserId;

  const handleClick = async () => {
    if (isSelf && isActive) return;
    setIsPending(true);
    const result = await setUserActive(userId, !isActive);
    setIsPending(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success(isActive ? "Użytkownik został dezaktywowany" : "Użytkownik został aktywowany");
    router.refresh();
  };

  if (isSelf && isActive) {
    return (
      <Button variant="outline" size="sm" disabled aria-label="Nie możesz dezaktywować własnego konta">
        Dezaktywuj (to Ty)
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isActive ? "Dezaktywuj użytkownika" : "Aktywuj użytkownika"}
    >
      {isPending ? "..." : isActive ? "Dezaktywuj" : "Aktywuj"}
    </Button>
  );
}
