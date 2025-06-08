import { useState } from 'react';
import type { Dataset } from '../sidebar/services/dataset-service';
import type { Model } from '../sidebar/services/model-service';
import { DatasetList } from './dataset-list';
import { ModelList } from './model-list';
import { TrainingParamsStep } from './params-list';

export const ServiceStarter = ({
  setStep,
  step,
}: {
  setStep: (step: number) => void;
  step: number;
}) => {
  const [selectedModel, setSelectedModel] = useState<Model | undefined>();
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([]);
  const [trainingParams, setTrainingParams] = useState<{
    batchSize: number;
    epochs: number;
  }>({ batchSize: 16, epochs: 3 });

  return (
    <div className="flex flex-col gap-6">
      {step === 0 && (
        <ModelList
          onNext={() => setStep(1)}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
      )}
      {step === 1 && (
        <DatasetList
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
          selectedDatasets={selectedDatasets}
          setSelectedDatasets={setSelectedDatasets}
        />
      )}
      {step === 2 && (
        <TrainingParamsStep
          onBack={() => setStep(1)}
          selectedDatasets={selectedDatasets}
          selectedModel={selectedModel}
          setTrainingParams={setTrainingParams}
          trainingParams={trainingParams}
        />
      )}
    </div>
  );
};
