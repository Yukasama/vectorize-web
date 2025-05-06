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
import { DatasetUpload } from '../sidebar/dataset-upload';
import { ListViewToggle } from './list-view-toggle';

interface Dataset {
  id: string;
  name: string;
}

export const DatasetList = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [view, setView] = useState<'grid' | 'table'>('grid');

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

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Datensätze</h2>
          <DatasetUpload />
        </div>
        <ListViewToggle setView={setView} view={view} />
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 gap-4">
          {datasets.map((dataset) => (
            <Card className="p-4" key={dataset.id}>
              <p className="text-sm font-medium">{dataset.name}</p>
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
            {datasets.map((dataset) => (
              <TableRow key={dataset.id}>
                <TableCell>{dataset.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
