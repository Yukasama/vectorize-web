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
import { ThemeToggle } from '@/features/theme/theme-toggle';
import { useState } from 'react';
import { ServiceStarter } from '../features/service-starter/service-starter';

export default function Page() {
  const [step, setStep] = useState(0);
  // Breadcrumbs: 0 = model, 1 = dataset, 2 = service
  const getBreadcrumbColor = (idx: number) =>
    step === idx ? 'text-foreground font-semibold' : 'text-muted-foreground';

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
                  <span className={getBreadcrumbColor(0)}>Select model</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className={getBreadcrumbColor(1)}>Select dataset</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className={getBreadcrumbColor(2)}>Start service</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="grid h-[calc(100dvh-4rem)] min-h-0 w-full flex-1 gap-4 p-4 md:grid-cols-[1fr_320px]">
            <div className="bg-muted/50 flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border-2 border-transparent shadow-lg transition-colors">
              <ServiceStarter setStep={setStep} step={step} />
            </div>
            <div className="bg-muted/50 hidden h-full min-h-0 w-full rounded-xl md:block" />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
