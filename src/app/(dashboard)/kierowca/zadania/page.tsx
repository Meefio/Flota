import { requireDriver } from "@/lib/auth-utils";
import { getAllDriverAssignedTasks } from "@/lib/queries/notes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskToggle } from "@/components/vehicles/task-toggle";
import Link from "next/link";

export default async function DriverTasksPage() {
  const session = await requireDriver();
  const tasks = await getAllDriverAssignedTasks(Number(session.user.id));

  const pendingTasks = tasks.filter((t) => !t.isDone);
  const completedTasks = tasks.filter((t) => t.isDone);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Zadania</h1>

      {tasks.length === 0 ? (
        <p className="text-muted-foreground">
          Nie masz przypisanych zadań.
        </p>
      ) : (
        <>
          {pendingTasks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">
                Do wykonania ({pendingTasks.length})
              </h2>
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}

          {completedTasks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-muted-foreground">
                Wykonane ({completedTasks.length})
              </h2>
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TaskCard({
  task,
}: {
  task: {
    id: number;
    content: string;
    isDone: boolean;
    vehicleId: number;
    registrationNumber: string;
    createdByName: string;
    createdAt: Date;
  };
}) {
  return (
    <Card className={task.isDone ? "opacity-60" : undefined}>
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <TaskToggle noteId={task.id} isDone={task.isDone} />
          <div className="flex-1 min-w-0">
            <p
              className={
                task.isDone
                  ? "line-through text-muted-foreground"
                  : "text-sm"
              }
            >
              {task.content}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <Link href={`/kierowca/pojazdy/${task.vehicleId}`}>
                <Badge variant="outline" className="text-xs">
                  {task.registrationNumber}
                </Badge>
              </Link>
              <span className="text-xs text-muted-foreground">
                od: {task.createdByName}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(task.createdAt).toLocaleDateString("pl-PL")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
