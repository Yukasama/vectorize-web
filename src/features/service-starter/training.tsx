'use client';

import { Button } from '@/components/ui/button';
import { DatasetUpload } from '@/features/sidebar/dataset/dataset-upload';
import { ModelUpload } from '@/features/sidebar/model/model-upload';
import React, { useState } from 'react';

export const TrainingBox = () => {
  const [models, setModels] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<string[]>([]);

  const handleDropModel = (e: React.DragEvent) => {
    e.preventDefault();
    const modelName = e.dataTransfer.getData('text/plain');
    if (modelName) {
      setModels((prev) => [...prev, modelName]);
    }
  };

  const handleDropDataset = (e: React.DragEvent) => {
    e.preventDefault();
    const datasetName = e.dataTransfer.getData('text/plain');
    if (datasetName) {
      setDatasets((prev) => [...prev, datasetName]);
    }
  };

  const handleStartTraining = () => {
    // Logik für Training starten
    console.log('Training gestartet mit:', { datasets, models });
    alert('Training gestartet!');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Modelle */}
        <div
          className="rounded border-2 border-dashed p-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropModel}
        >
          <p className="text-sm font-semibold">Modelle</p>
          <ul className="mt-2 space-y-1">
            {models.map((model, index) => (
              <li className="text-sm" key={index}>
                {model}
              </li>
            ))}
          </ul>
          <ModelUpload />
        </div>

        {/* Datensätze */}
        <div
          className="rounded border-2 border-dashed p-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropDataset}
        >
          <p className="text-sm font-semibold">Datensätze</p>
          <ul className="mt-2 space-y-1">
            {datasets.map((dataset, index) => (
              <li className="text-sm" key={index}>
                {dataset}
              </li>
            ))}
          </ul>
          <DatasetUpload />
        </div>
      </div>

      {/* Training starten Button */}
      <div className="mt-4 flex justify-end">
        <Button onClick={handleStartTraining} variant="default">
          Training starten
        </Button>
      </div>
    </div>
  );
};
