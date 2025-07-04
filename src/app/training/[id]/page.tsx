'use client';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/features/sidebar/app-sidebar';
import { ThemeToggle } from '@/features/theme/theme-toggle';
import { TrainingData } from '@/features/training/training-data';
import { useParams } from 'next/navigation';

export default function TrainingDetailPage() {
  // Get the training ID from the URL params
  const params = useParams();
  const trainingId = typeof params.id === 'string' ? params.id : '';

  // Prepare the training name for the header
  const trainingNameContent = (
    <span className="text-muted-foreground text-sm font-medium">
      Training: {trainingId}
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
            {trainingNameContent}
          </div>
          <ThemeToggle />
        </header>
        <Separator className="mb-4" />
        <main className="flex-1 p-8">
          {/* Render the main training details component */}
          <TrainingData trainingId={trainingId} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
