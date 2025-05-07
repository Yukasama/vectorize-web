'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatasetList } from '@/features/service-starter/dataset-list';
import { ModelList } from '@/features/service-starter/model-list';
import { Sidebar } from '@/features/sidebar/sidebar';
import { useState } from 'react';
import { ThemeToggle } from '../features/theme/theme-toggle';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center gap-4">
            <p className="text-xl font-semibold">TXT2VEC</p>
          </div>

          {/* Darkmode Toggle */}
          <ThemeToggle />
        </div>

        <div
          className="mt-6 grid gap-4"
          style={{ gridTemplateColumns: `1fr 16rem` }}
        >
          {/* Tabs + Ergebnisse */}
          <Card
            className={`bg-accent overflow-hidden text-gray-100 transition-all duration-300`}
            style={{
              marginRight: '1rem',
            }}
          >
            <CardContent className="h-full max-h-[calc(100vh-6rem)] space-y-4 overflow-y-auto">
              <Tabs className="w-full" defaultValue="models">
                <TabsList>
                  <TabsTrigger value="models">Modelle</TabsTrigger>
                  <TabsTrigger value="datasets">Datensätze</TabsTrigger>
                </TabsList>
                <TabsContent value="models">
                  <ModelList />
                </TabsContent>
                <TabsContent value="datasets">
                  <DatasetList />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-accent w-64 overflow-hidden text-gray-100">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground h-full overflow-y-auto">
              Evaluation ist fertiggestellt
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
