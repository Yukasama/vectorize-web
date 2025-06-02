'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/features/sidebar/app-sidebar';
import { ThemeToggle } from '../features/theme/theme-toggle';

export default function Page() {
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
                  <BreadcrumbLink href="#">Select model</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Select dataset</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Start service</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="bg-muted/50 min-h-[60vh] rounded-xl" />
            <div className="bg-muted/50 min-h-[60vh] rounded-xl" />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
