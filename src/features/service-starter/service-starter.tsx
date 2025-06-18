import { useState } from 'react';
import type { Dataset } from '../sidebar/services/dataset-service';
import type { Model } from '../sidebar/services/model-service';
import { TrainingParamsStep } from './params-list';
import { SelectDataset } from './select-dataset';
import { SelectModel } from './select-model';

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
        <SelectModel
          initialSelectedModel={selectedModel}
          onNext={() => setStep(1)}
          setSelectedModel={setSelectedModel}
        />
      )}
      {step === 1 && (
        <SelectDataset
          initialSelectedDatasets={selectedDatasets}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
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
