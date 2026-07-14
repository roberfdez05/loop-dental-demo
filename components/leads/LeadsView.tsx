import { StatsCards } from "@/components/leads/StatsCards";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { LeadDetailPanel } from "@/components/leads/LeadDetailPanel";
import { PipelineBoard } from "@/components/leads/PipelineBoard";
import { HeroMetric } from "@/components/dashboard/HeroMetric";
import { DemoModeButton } from "@/components/dashboard/DemoModeButton";
import { DailyBriefing } from "@/components/dashboard/DailyBriefing";
import { ActionCenter } from "@/components/dashboard/ActionCenter";
import { MetricsCharts } from "@/components/dashboard/MetricsCharts";
import { InactivePatients } from "@/components/dashboard/InactivePatients";

export function LeadsView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <HeroMetric />
          <DemoModeButton />
        </div>

        <DailyBriefing />

        <ActionCenter />

        <div className="flex flex-col gap-4">
          <StatsCards />
          <MetricsCharts />
        </div>

        <InactivePatients />

        <PipelineBoard />

        <div>
          <h2 className="mb-3 text-sm font-semibold text-zinc-900">Todos los leads</h2>
          <LeadsTable />
        </div>
      </div>

      <LeadDetailPanel />
    </div>
  );
}
