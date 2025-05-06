'use client';

import { ModelUpload } from '@/components/model-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Model {
  id: string;
  name: string;
}

export const ModelList = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get<Model[]>(
          'http://localhost:8000/v1/models',
        );
        setModels(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Modelle:', error);
        setModels([]);
      }
    };

    void fetchModels();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Modelle</CardTitle>
        <div className="flex items-center space-x-2">
          <ModelUpload />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {models.slice(0, visibleCount).map((model) => (
          <div className="rounded border p-2" key={model.id}>
            {model.name}
          </div>
        ))}
        {visibleCount < models.length && (
          <Button className="w-full" onClick={handleShowMore} variant="outline">
            Mehr anzeigen
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
