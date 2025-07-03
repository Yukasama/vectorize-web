'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/features/sidebar/app-sidebar';
import { TaskList } from '@/features/tasks/task-list';
import { ThemeToggle } from '@/features/theme/theme-toggle';
import { useState } from 'react';
import { ServiceStarter } from '../features/service-starter/service-starter';

export default function Page() {
  const [step, setStep] = useState(0);

  // Breadcrumbs: 0 = model, 1 = dataset, 2 = service
  const getBreadcrumbColor = (idx: number) =>
    step === idx ? 'text-foreground font-semibold' : 'text-muted-foreground';

  const handleBreadcrumbClick = (targetStep: number) => {
    if (targetStep < step) {
      setStep(targetStep);
    }
  };

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
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <button
                    className={`${getBreadcrumbColor(0)} ${
                      step > 0
                        ? 'cursor-pointer hover:underline'
                        : 'cursor-default'
                    }`}
                    onClick={() => handleBreadcrumbClick(0)}
                    type="button"
                  >
                    Select model
                  </button>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <button
                    className={`${getBreadcrumbColor(1)} ${
                      step > 1
                        ? 'cursor-pointer hover:underline'
                        : 'cursor-default'
                    }`}
                    onClick={() => handleBreadcrumbClick(1)}
                    type="button"
                  >
                    Select dataset
                  </button>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <button
                    className={`${getBreadcrumbColor(2)} ${
                      step > 2
                        ? 'cursor-pointer hover:underline'
                        : 'cursor-default'
                    }`}
                    onClick={() => handleBreadcrumbClick(2)}
                    type="button"
                  >
                    Start service
                  </button>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>
        <div className="flex h-[calc(100dvh-4rem)] flex-col">
          <div className="grid h-full min-h-0 w-full gap-4 p-4 md:grid-cols-[1fr_320px]">
            <div className="bg-muted/50 flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border-2 border-transparent shadow-lg transition-colors">
              <ServiceStarter setStep={setStep} step={step} />
            </div>
            <div className="h-full min-h-0">
              <TaskList />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
