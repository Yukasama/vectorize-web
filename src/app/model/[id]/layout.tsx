import { SidebarProvider } from '@/components/ui/sidebar';

export default function ModelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
