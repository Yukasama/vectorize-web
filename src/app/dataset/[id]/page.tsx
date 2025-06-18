import { AppSidebar } from '@/features/sidebar/app-sidebar';

export default function DatasetDetailPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-8">
        <h1 className="mb-4 text-2xl font-bold">Dataset Details</h1>
      </main>
    </div>
  );
}
