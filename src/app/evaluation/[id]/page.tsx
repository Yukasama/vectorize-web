'use client';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { EvaluationScatterChart } from '@/features/evaluation/bar-chart';
import { EvaluationData } from '@/features/evaluation/evaluation-data';
import { EvaluationList } from '@/features/evaluation/evaluation-list';
import { fetchEvaluationStatus } from '@/features/service-starter/evaluation-service';
import { AppSidebar } from '@/features/sidebar/app-sidebar';
import { ThemeToggle } from '@/features/theme/theme-toggle';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const filterMetrics = (obj: unknown): Record<string, number> | undefined => {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const entries = Object.entries(obj).filter(
      ([, v]) => typeof v === 'number',
    );
    if (entries.length > 0) {
      return Object.fromEntries(entries) as Record<string, number>;
    }
  }
  return undefined;
};

export default function EvaluationDetailPage() {
  const params = useParams();
  const evaluationId = typeof params.id === 'string' ? params.id : '';

  const { data: status } = useQuery({
    enabled: !!evaluationId,
    queryFn: () => fetchEvaluationStatus(evaluationId),
    queryKey: ['evaluation-status', evaluationId],
  });

  const evaluationNameContent = (
    <span className="text-muted-foreground text-sm">
      Evaluation: {evaluationId}
    </span>
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              className="mr-2 data-[orientation=vertical]:h-4"
              orientation="vertical"
            />
            {evaluationNameContent}
          </div>
          <ThemeToggle />
        </header>
        <Separator className="mb-4" />
        <main className="flex-1 p-8">
          <EvaluationData evaluationId={evaluationId} />
          <EvaluationScatterChart
            baselineMetrics={filterMetrics(status?.baseline_metrics)}
            evaluationMetrics={filterMetrics(status?.evaluation_metrics)}
          />

          {/* Metrics sections */}
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {status?.evaluation_metrics && (
                <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
                  <h3 className="mb-3 font-semibold">Evaluation metrics</h3>
                  <pre className="bg-muted overflow-x-auto rounded p-2 text-xs">
                    {JSON.stringify(status.evaluation_metrics, undefined, 2)}
                  </pre>
                </div>
              )}
              {status?.baseline_metrics && (
                <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
                  <h3 className="mb-3 font-semibold">Baseline metrics</h3>
                  <pre className="bg-muted overflow-x-auto rounded p-2 text-xs">
                    {JSON.stringify(status.baseline_metrics, undefined, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Related Evaluations Table */}
          {status?.model_tag && status.dataset_info && (
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold">
                Related Evaluations (Same Model & Dataset)
              </h3>
              <EvaluationList
                currentEvaluationId={evaluationId}
                datasetId={status.dataset_info
                  .split(',')[0]
                  ?.trim()
                  .replace(/^Dataset:\s*/, '')}
                modelTag={status.model_tag}
              />
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
