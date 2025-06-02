'use client';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { ModelUpload } from '../sidebar/model/model-upload';
import { fetchModels } from '../sidebar/services/model-service'; // <-- Importiere fetchModels
import { ListViewToggle } from './list-view-toggle';

interface Model {
  id: string;
  name: string;
}

export const ModelList = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [view, setView] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await fetchModels(); // <-- Nutze den Service
        setModels(data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Modelle:', error);
      }
    };

    void loadModels();
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Modelle</h2>
          <ModelUpload />
        </div>
        <ListViewToggle setView={setView} view={view} />
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-4 gap-4">
          {models.map((model) => (
            <Card className="p-4" key={model.id}>
              <p className="text-sm font-medium">{model.name}</p>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.id}>
                <TableCell>{model.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
