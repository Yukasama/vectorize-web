import { SidebarProvider } from '@/components/ui/sidebar';

export default function DatasetLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
