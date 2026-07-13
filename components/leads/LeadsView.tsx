import { StatsCards } from "@/components/leads/StatsCards";
import { LeadsTable } from "@/components/leads/LeadsTable";

export function LeadsView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Leads</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Pacientes captados automáticamente desde tus conversaciones.
          </p>
        </div>
        <StatsCards />
        <LeadsTable />
      </div>
    </div>
  );
}
