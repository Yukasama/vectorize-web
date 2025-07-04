'use client';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { EvaluationScatterChart } from '@/features/evaluation/bar-chart';
import { EvaluationData } from '@/features/evaluation/evaluation-data';
import { fetchEvaluationStatus } from '@/features/service-starter/evaluation-service';
import { AppSidebar } from '@/features/sidebar/app-sidebar';
import { fetchModelByTag } from '@/features/sidebar/services/model-service';
import { ThemeToggle } from '@/features/theme/theme-toggle';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Helper to filter only numeric metrics from an object
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
  // Get evaluation ID from URL params
  const params = useParams();
  const evaluationId = typeof params.id === 'string' ? params.id : '';

  // Fetch evaluation status using React Query
  const { data: status } = useQuery({
    enabled: !!evaluationId,
    queryFn: () => fetchEvaluationStatus(evaluationId),
    queryKey: ['evaluation-status', evaluationId],
  });

  // State for resolved model and baseline IDs
  const [modelId, setModelId] = useState<string | undefined>();
  const [baselineId, setBaselineId] = useState<string | undefined>();

  // Resolve model and baseline IDs from tags when status changes
  useEffect(() => {
    const resolveModelIds = async () => {
      if (status?.model_tag) {
        const model = await fetchModelByTag(status.model_tag);
        setModelId(model?.id);
      } else {
        setModelId(undefined);
      }
      if (status?.baseline_model_tag) {
        const baseline = await fetchModelByTag(status.baseline_model_tag);
        setBaselineId(baseline?.id);
      } else {
        setBaselineId(undefined);
      }
    };
    void resolveModelIds();
  }, [status?.model_tag, status?.baseline_model_tag]);

  // Prepare evaluation name for header
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
          {/* Render evaluation status and model/baseline cards */}
          <EvaluationData
            baselineId={baselineId}
            evaluationId={evaluationId}
            modelId={modelId}
          />
          {/* Render scatter chart for evaluation and baseline metrics */}
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
                  {/* Pretty-print evaluation metrics as JSON */}
                  <pre className="bg-muted overflow-x-auto rounded p-2 text-xs">
                    {JSON.stringify(status.evaluation_metrics, undefined, 2)}
                  </pre>
                </div>
              )}
              {status?.baseline_metrics && (
                <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
                  <h3 className="mb-3 font-semibold">Baseline metrics</h3>
                  {/* Pretty-print baseline metrics as JSON */}
                  <pre className="bg-muted overflow-x-auto rounded p-2 text-xs">
                    {JSON.stringify(status.baseline_metrics, undefined, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
