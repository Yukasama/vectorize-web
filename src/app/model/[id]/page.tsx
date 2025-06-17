import { AppSidebar } from '@/features/sidebar/app-sidebar';

export default function ModelDetailPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-8">
        <h1 className="mb-4 text-2xl font-bold">Model Details</h1>
      </main>
    </div>
  );
}
