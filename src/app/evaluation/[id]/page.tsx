'use client';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { EvaluationData } from '@/features/evaluation/evaluation-data';
import { EvaluationScatterChart } from '@/features/evaluation/scatter-chart';
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
    <span className="max-w-xs text-lg font-semibold">{evaluationId}</span>
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
          <h1 className="mb-4 text-2xl font-bold">Evaluation Details</h1>
          <div className="mb-8">
            <span className="font-mono text-base">ID: {evaluationId}</span>
          </div>
          <EvaluationData evaluationId={evaluationId} />
          <EvaluationScatterChart
            baselineMetrics={filterMetrics(status?.baseline_metrics)}
            evaluationMetrics={filterMetrics(status?.evaluation_metrics)}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
