'use client';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ModelData } from '@/features/model/model-data';
import { AppSidebar } from '@/features/sidebar/app-sidebar';
import { fetchModelById } from '@/features/sidebar/services/model-service';
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
    enabled: !!modelId && modelId.length > 0,
    queryFn: () => fetchModelById(modelId),
    queryKey: ['model', modelId],
  });

  let modelNameContent;
  if (!modelId || isLoading) {
    modelNameContent = (
      <span className="text-muted-foreground text-sm">Loading...</span>
    );
  } else if (error) {
    modelNameContent = (
      <span className="text-destructive text-sm">Error loading model</span>
    );
  } else if (model?.name) {
    const truncatedName =
      model.name.length > 50 ? `${model.name.slice(0, 50)}...` : model.name;
    modelNameContent = (
      <span className="text-muted-foreground text-sm">
        Model: {truncatedName}
      </span>
    );
  } else {
    modelNameContent = (
      <span className="text-destructive text-sm">Model not found</span>
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
            {modelNameContent}
          </div>
          <ThemeToggle />
        </header>
        <Separator className="mb-4" />
        <main className="flex-1 p-8">
          <h1 className="mb-4 text-2xl font-bold">Model Details</h1>
          {modelId ? (
            <ModelData modelId={modelId} modelTag={model?.model_tag} />
          ) : (
            <div className="text-muted-foreground">Loading model...</div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
