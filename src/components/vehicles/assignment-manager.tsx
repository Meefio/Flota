"use client";

import { useActionState, useState } from "react";
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
import { assignVehicle, unassignByAssignmentId } from "@/lib/actions/assignments";
import { toast } from "sonner";
import { UserPlus, UserMinus } from "lucide-react";
import { format } from "date-fns";

interface CurrentAssignment {
  id: number;
  driverName: string;
  assignedFrom: string;
  notes?: string | null;
}

interface AssignmentManagerProps {
  vehicleId: number;
  currentAssignments: CurrentAssignment[];
  drivers: { id: number; name: string }[];
}

export function AssignmentManager({
  vehicleId,
  currentAssignments,
  drivers,
}: AssignmentManagerProps) {
  const [showForm, setShowForm] = useState(false);

  async function handleAssign(_prev: unknown, formData: FormData) {
    formData.set("vehicleId", String(vehicleId));
    formData.set("assignedFrom", format(new Date(), "yyyy-MM-dd"));
    const result = await assignVehicle(formData);
    if ("error" in result) return result;
    toast.success("Kierowca został przypisany");
    setShowForm(false);
    return null;
  }

  const handleUnassign = async (assignmentId: number) => {
    const result = await unassignByAssignmentId(assignmentId);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Przypisanie zostało zakończone");
  };

  const [state, formAction, isPending] = useActionState(handleAssign, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Przypisanie kierowcy</CardTitle>
      </CardHeader>
      <CardContent>
        {currentAssignments.length > 0 ? (
          <div className="space-y-3">
            {currentAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">{assignment.driverName}</p>
                  <p className="text-sm text-muted-foreground">
                    Od: {assignment.assignedFrom}
                  </p>
                  {assignment.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {assignment.notes}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnassign(assignment.id)}
                  aria-label={`Odepnij ${assignment.driverName}`}
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Odepnij
                </Button>
              </div>
            ))}
            {showForm ? (
              <form action={formAction} className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>Kierowca</Label>
                  <Select name="userId">
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz kierowcę" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notatki</Label>
                  <Input name="notes" placeholder="Opcjonalne notatki" />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={isPending}>
                    {isPending ? "Przypisywanie..." : "Przypisz"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowForm(false)}
                  >
                    Anuluj
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Przypisz kolejnego kierowcę
              </Button>
            )}
          </div>
        ) : showForm ? (
          <form action={formAction} className="space-y-3">
            <div className="space-y-2">
              <Label>Kierowca</Label>
              <Select name="userId">
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz kierowcę" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notatki</Label>
              <Input name="notes" placeholder="Opcjonalne notatki" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? "Przypisywanie..." : "Przypisz"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Anuluj
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Brak przypisanego kierowcy
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Przypisz kierowcę
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
