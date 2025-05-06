'use client';

import { DatasetUpload } from '@/components/dataset-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Dataset {
  id: string;
  name: string;
}

export const DatasetList = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await axios.get<Dataset[]>(
          'http://localhost:8000/v1/datasets',
        );
        setDatasets(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Datensätze:', error);
        setDatasets([]);
      }
    };

    void fetchDatasets();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Datensätze</CardTitle>
        <div className="flex items-center space-x-2">
          <DatasetUpload />

          {/* Plus Button */}
          <Button size="icon" variant="ghost">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {datasets.slice(0, visibleCount).map((dataset) => (
          <div className="rounded border p-2" key={dataset.id}>
            {dataset.name}
          </div>
        ))}
        {visibleCount < datasets.length && (
          <Button className="w-full" onClick={handleShowMore} variant="outline">
            Mehr anzeigen
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
