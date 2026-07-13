import { StatsCards } from "@/components/leads/StatsCards";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { DailyBriefing } from "@/components/dashboard/DailyBriefing";
import { MetricsCharts } from "@/components/dashboard/MetricsCharts";
import { InactivePatients } from "@/components/dashboard/InactivePatients";

export function LeadsView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8">
        <DailyBriefing />

        <div className="flex flex-col gap-4">
          <StatsCards />
          <MetricsCharts />
        </div>

        <InactivePatients />

        <div>
          <h2 className="mb-3 text-sm font-semibold text-zinc-900">Leads</h2>
          <LeadsTable />
        </div>
      </div>
    </div>
  );
}
