'use client';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { CounterChart } from '@/features/model/counter-chart';
import { ModelTaskList } from '@/features/model/model-task-list';
import { AppSidebar } from '@/features/sidebar/app-sidebar';
import { fetchModelByTag } from '@/features/sidebar/services/model-service';
import { ThemeToggle } from '@/features/theme/theme-toggle';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function ModelDetailPage() {
  const params = useParams();
  const modelId = typeof params.id === 'string' ? params.id : '';
  const {
    data: model,
    error,
    isLoading,
  } = useQuery({
    enabled: !!modelId,
    queryFn: () => fetchModelByTag(modelId),
    queryKey: ['model', modelId],
  });

  let modelNameContent;
  if (isLoading) {
    modelNameContent = (
      <span className="text-muted-foreground text-sm">Loading...</span>
    );
  } else if (error) {
    modelNameContent = (
      <span className="text-destructive text-sm">Error loading model</span>
    );
  } else if (model?.name) {
    modelNameContent = (
      <span
        className="max-w-xs truncate text-lg font-semibold"
        title={model.name}
      >
        {model.name}
      </span>
    );
  }

  const modelTag = model?.model_tag ?? '';

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
            {modelNameContent}
          </div>
          <ThemeToggle />
        </header>
        <Separator className="mb-4" />
        <main className="flex-1 p-8">
          <h1 className="mb-4 text-2xl font-bold">Model Details</h1>
          <div className="mb-8">
            <CounterChart modelTag={modelTag} />
          </div>
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">Tasks for this Model</h2>
            <ModelTaskList modelTag={modelTag} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
