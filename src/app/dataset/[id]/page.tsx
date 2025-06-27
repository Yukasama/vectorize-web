'use client';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/features/sidebar/app-sidebar';
import { fetchDatasetById } from '@/features/sidebar/services/dataset-service';
import { ThemeToggle } from '@/features/theme/theme-toggle';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function DatasetDetailPage() {
  const params = useParams();
  const datasetId = typeof params.id === 'string' ? params.id : '';
  const {
    data: dataset,
    error,
    isLoading,
  } = useQuery({
    enabled: !!datasetId,
    queryFn: () => fetchDatasetById(datasetId),
    queryKey: ['dataset', datasetId],
  });

  let datasetNameContent;
  if (isLoading) {
    datasetNameContent = (
      <span className="text-muted-foreground text-sm">Loading...</span>
    );
  } else if (error) {
    datasetNameContent = (
      <span className="text-destructive text-sm">Error loading dataset</span>
    );
  } else if (dataset?.name) {
    datasetNameContent = (
      <span
        className="max-w-xs truncate text-lg font-semibold"
        title={dataset.name}
      >
        {dataset.name}
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
            {datasetNameContent}
          </div>
          <ThemeToggle />
        </header>
        <Separator className="mb-4" />
        <main className="flex-1 p-8">
          <h1 className="mb-4 text-2xl font-bold">Dataset Details</h1>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
