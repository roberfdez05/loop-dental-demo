import { TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Sparkline } from "@/components/ui/Sparkline";
import { SEED_METRICS, type MetricSeries } from "@/lib/data/seed-metrics";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { cn } from "@/lib/utils/cn";

function formatValue(series: MetricSeries, value: number): string {
  switch (series.unit) {
    case "eur":
      return formatCurrency(value);
    case "percent":
      return `${Math.round(value)}%`;
    case "minutes":
      return `${Math.round(value)} min`;
    default:
      return `${Math.round(value)}`;
  }
}

export function MetricsCharts() {
  return (
    <Card className="p-4 sm:p-5">
      <p className="mb-4 text-sm font-medium text-zinc-500">Últimos 7 días</p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {SEED_METRICS.map((series) => {
          const current = series.values[series.values.length - 1];
          const first = series.values[0];
          const isImproving =
            series.goodDirection === "up" ? current >= first : current <= first;

          return (
            <div key={series.key}>
              <p className="truncate text-xs font-medium text-zinc-400">{series.label}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-lg font-semibold tracking-tight text-zinc-900">
                  {formatValue(series, current)}
                </span>
                <span
                  className={cn(
                    "flex items-center",
                    isImproving ? "text-accent-500" : "text-zinc-300",
                  )}
                >
                  {series.goodDirection === "up" ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                </span>
              </div>
              <Sparkline values={series.values} width={110} height={30} className="mt-1" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
