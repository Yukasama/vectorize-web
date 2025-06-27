'use client';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/features/sidebar/app-sidebar';
import { ThemeToggle } from '@/features/theme/theme-toggle';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

declare function fetchEvaluationById(
  id: string,
): Promise<undefined | { id: string; name?: string }>;

export default function EvaluationDetailPage() {
  const params = useParams();
  const evaluationId = typeof params.id === 'string' ? params.id : '';
  const {
    data: evaluation,
    error,
    isLoading,
  } = useQuery({
    enabled: !!evaluationId,
    queryFn: () => fetchEvaluationById(evaluationId),
    queryKey: ['evaluation', evaluationId],
  });

  let evaluationNameContent;
  if (isLoading) {
    evaluationNameContent = (
      <span className="text-muted-foreground text-sm">Loading...</span>
    );
  } else if (error) {
    evaluationNameContent = (
      <span className="text-destructive text-sm">Error loading evaluation</span>
    );
  } else if (evaluation?.name) {
    evaluationNameContent = (
      <span
        className="max-w-xs truncate text-lg font-semibold"
        title={evaluation.name}
      >
        {evaluation.name}
      </span>
    );
  } else {
    evaluationNameContent = (
      <span className="max-w-xs truncate text-lg font-semibold">
        {evaluationId}
      </span>
    );
  }

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
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
