import { redirect } from "next/navigation";
import { requireDriver } from "@/lib/auth-utils";

export default async function DriverDashboardPage() {
  await requireDriver();
  redirect("/kierowca/pojazdy");
}
