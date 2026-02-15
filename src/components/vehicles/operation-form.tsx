"use client";

import { useActionState, useState } from "react";
import { addYears, format } from "date-fns";
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
import { DEADLINE_TYPE_LABELS, DEADLINE_TYPES_FOR_VEHICLE } from "@/lib/constants";
import { recordOperation } from "@/lib/actions/deadlines";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { DeadlineType } from "@/db/schema";

interface OperationFormProps {
  vehicleId: number;
  defaultType?: DeadlineType;
  vehicleType?: string;
}

export function OperationForm({ vehicleId, defaultType, vehicleType = "truck" }: OperationFormProps) {
  const [selectedType, setSelectedType] = useState<string>(defaultType ?? "");

  async function handleAction(_prev: unknown, formData: FormData) {
    formData.set("vehicleId", String(vehicleId));
    const result = await recordOperation(formData);
    if ("error" in result) {
      return result;
    }
    toast.success("Operacja została zapisana");
    return { success: true };
  }

  const [state, formAction, isPending] = useActionState(handleAction, null);
  const errors = state && "error" in state
    ? (state.error as Record<string, string[]>)
    : undefined;

  const today = format(new Date(), "yyyy-MM-dd");
  const oneYearFromToday = format(addYears(new Date(), 1), "yyyy-MM-dd");
  const canSubmit = selectedType.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Zgłoś operację
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zgłoś wykonaną operację</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="deadlineType" value={selectedType} aria-hidden />
          <div className="space-y-2">
            <Label htmlFor="operation-deadline-type">Typ operacji</Label>
            <Select
              name="operation-deadline-type"
              value={selectedType}
              onValueChange={setSelectedType}
              required
            >
              <SelectTrigger id="operation-deadline-type" aria-required="true" aria-invalid={!!errors?.deadlineType}>
                <SelectValue placeholder="Wybierz typ" />
              </SelectTrigger>
              <SelectContent>
                {(DEADLINE_TYPES_FOR_VEHICLE[vehicleType] ?? DEADLINE_TYPES_FOR_VEHICLE.truck).map((type) => (
                  <SelectItem key={type} value={type}>
                    {DEADLINE_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.deadlineType && (
              <p className="text-sm text-destructive" role="alert">
                {errors.deadlineType[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Data wykonania</Label>
            <Input name="performedAt" type="date" defaultValue={today} />
            {errors?.performedAt && (
              <p className="text-sm text-destructive">
                {errors.performedAt[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Nowa data ważności</Label>
            <Input name="newExpiryDate" type="date" defaultValue={oneYearFromToday} />
            {errors?.newExpiryDate && (
              <p className="text-sm text-destructive">
                {errors.newExpiryDate[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Notatki</Label>
            <Textarea name="notes" placeholder="Dodatkowe informacje..." rows={3} />
          </div>

          <Button type="submit" className="w-full" disabled={isPending || !canSubmit}>
            {isPending ? "Zapisywanie..." : "Zapisz operację"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
