'use client';

import { DatasetUpload } from '@/components/dataset-upload';
import { ModelUpload } from '@/components/model-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { ThemeToggle } from '../features/theme/theme-toggle';

export default function Home() {
  return (
    <div className="p-6">
      <p className="mb-4 text-xl font-semibold">Nextjs-Template</p>
      <ThemeToggle />

      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="space-y-4">
          {/* Modelle */}
          <Card>
            <CardHeader>
              <CardTitle>Modelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-between" variant="outline">
                Model B{' '}
                <span className="bg-primary rounded px-2 py-0.5 text-xs text-white">
                  New
                </span>
              </Button>
              <Button className="w-full" variant="outline">
                Model 1
              </Button>
              <div className="flex gap-2 pt-2">
                <ModelUpload />
              </div>
            </CardContent>
          </Card>

          {/* Datensätze */}
          <Card>
            <CardHeader>
              <CardTitle>Datensätze</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Generierung
              </Button>
              <Button className="w-full" variant="ghost">
                <DatasetUpload />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabs + Ergebnisse */}
        <div className="col-span-2 space-y-4">
          <Tabs className="w-full" defaultValue="evaluation">
            <TabsList>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            </TabsList>
            <TabsContent value="training">
              <Card>
                <CardContent className="text-muted-foreground p-6">
                  Trainingsinhalte anzeigen...
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="evaluation">
              <Card>
                <CardContent className="text-muted-foreground p-6">
                  Evaluationsinhalte anzeigen...
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Trainingsergebnisse</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground p-6">
              Ergebnisse des Modells nach Training anzeigen...
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Evaluation ist fertiggestellt
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
