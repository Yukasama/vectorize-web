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
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ModelUpload } from '../sidebar/model-upload';
import { ListViewToggle } from './list-view-toggle';

interface Model {
  id: string;
  name: string;
}

export const ModelList = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [view, setView] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Beispiel-Daten aus der JSON-Datei abrufen
        const response = await axios.get<Model[]>('/data/models.json');
        setModels(response.data);

        // Auskommentierte Logik für die spätere Verwendung der echten Datenbank
        /*
        const response = await axios.get<Model[]>(
          'http://localhost:8000/v1/models',
        );
        setModels(response.data);
        */
      } catch (error) {
        console.error('Fehler beim Abrufen der Modelle:', error);
      }
    };

    void fetchModels();
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
        <div className="grid grid-cols-2 gap-4">
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
