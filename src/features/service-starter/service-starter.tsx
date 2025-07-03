import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import type { Dataset } from '../sidebar/services/dataset-service';
import type { Model } from '../sidebar/services/model-service';
import { EvaluationParamsStep } from './evaluation-params';
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
  const [evaluationParams, setEvaluationParams] = useState<{
    baselineModelTag?: string;
    maxSamples: number;
  }>({ maxSamples: 1000 });

  const [mode, setMode] = useState<'evaluation' | 'training'>('training');

  const handleReset = () => {
    setStep(0);
    setSelectedModel(undefined);
    setSelectedDatasets([]);
    setMode('training');
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
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
          <Tabs
            className="w-full"
            onValueChange={(v) => setMode(v as 'evaluation' | 'training')}
            value={mode}
          >
            <TabsList className="mb-4 w-full justify-center">
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            </TabsList>
            <TabsContent value="training">
              <TrainingParamsStep
                onBack={() => setStep(1)}
                onReset={handleReset}
                selectedDatasets={selectedDatasets}
                selectedModel={selectedModel}
                setTrainingParams={setTrainingParams}
                trainingParams={trainingParams}
              />
            </TabsContent>
            <TabsContent value="evaluation">
              <EvaluationParamsStep
                evaluationParams={evaluationParams}
                onBack={() => setStep(1)}
                onReset={handleReset}
                selectedDatasets={selectedDatasets}
                selectedModel={selectedModel}
                setEvaluationParams={setEvaluationParams}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};
