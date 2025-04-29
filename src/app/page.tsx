'use client';

import { DatasetList } from '@/components/dataset-list';
import { EvaluationBox } from '@/components/evaluation';
import { ModelList } from '@/components/model-list';
import { TrainingBox } from '@/components/training';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '../features/theme/theme-toggle';

export default function Home() {
  return (
    <div className="p-6">
      <p className="mb-4 text-xl font-semibold">Nextjs-Template</p>
      <ThemeToggle />

      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="space-y-4">
          {/* Modelle */}
          <ModelList />

          {/* Datensätze */}
          <DatasetList />
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
                  <TrainingBox />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="evaluation">
              <Card>
                <CardContent className="text-muted-foreground p-6">
                  <EvaluationBox />
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
