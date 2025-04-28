'use client';

import { DatasetUpload } from '@/components/dataset-upload';
import { ModelUpload } from '@/components/model-upload';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

export const EvaluationBox = () => {
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

  const handleStartEvaluation = () => {
    // Logik für Evaluation starten
    console.log('Evaluation gestartet mit:', { models, datasets });
    alert('Evaluation gestartet!');
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
              <li key={index} className="text-sm">
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
              <li key={index} className="text-sm">
                {dataset}
              </li>
            ))}
          </ul>
          <DatasetUpload />
        </div>
      </div>

      {/* Evaluation starten Button */}
      <div className="mt-4 flex justify-end">
        <Button onClick={handleStartEvaluation} variant="default">
          Evaluation starten
        </Button>
      </div>
    </div>
  );
};
