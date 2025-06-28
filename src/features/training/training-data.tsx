import { fetchTrainingById } from '@/features/service-starter/training-service';
import { useQuery } from '@tanstack/react-query';

interface TrainingDataProps {
  trainingId: string;
}

export const TrainingData = ({ trainingId }: TrainingDataProps) => {
  const {
    data: status,
    error,
    isLoading,
  } = useQuery({
    enabled: !!trainingId,
    queryFn: () => fetchTrainingById(trainingId),
    queryKey: ['training-status', trainingId],
  });

  if (isLoading) {
    return (
      <div className="text-muted-foreground">Loading training status...</div>
    );
  }
  if (error || !status) {
    return (
      <div className="text-destructive">Error loading training status</div>
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <span className="font-semibold">Status:</span> {status.status}
      </div>
      <div>
        <span className="font-semibold">Task ID:</span> {status.id}
      </div>
      {status.model_tag && (
        <div>
          <span className="font-semibold">Model tag:</span> {status.model_tag}
        </div>
      )}
      {status.started_at && (
        <div>
          <span className="font-semibold">Started at:</span> {status.started_at}
        </div>
      )}
      {status.finished_at && (
        <div>
          <span className="font-semibold">Finished at:</span>
          {status.finished_at}
        </div>
      )}
      {status.output_dir && (
        <div>
          <span className="font-semibold">Output dir:</span> {status.output_dir}
        </div>
      )}
      {status.error && (
        <div className="text-destructive">
          <span className="font-semibold">Error:</span> {status.error}
        </div>
      )}
      {typeof status.train_runtime === 'number' && (
        <div>
          <span className="font-semibold">Train runtime:</span>
          {status.train_runtime}
        </div>
      )}
      {typeof status.train_samples_per_second === 'number' && (
        <div>
          <span className="font-semibold">Samples/sec:</span>
          {status.train_samples_per_second}
        </div>
      )}
      {typeof status.train_steps_per_second === 'number' && (
        <div>
          <span className="font-semibold">Steps/sec:</span>
          {status.train_steps_per_second}
        </div>
      )}
      {typeof status.train_loss === 'number' && (
        <div>
          <span className="font-semibold">Train loss:</span> {status.train_loss}
        </div>
      )}
      {typeof status.epoch === 'number' && (
        <div>
          <span className="font-semibold">Epoch:</span> {status.epoch}
        </div>
      )}
      {typeof status.trained_model_id === 'string' &&
        status.trained_model_id && (
          <div>
            <span className="font-semibold">Trained model ID:</span>{' '}
            {status.trained_model_id}
          </div>
        )}
      {typeof status.validation_dataset_path === 'string' &&
        status.validation_dataset_path && (
          <div>
            <span className="font-semibold">Validation dataset path:</span>{' '}
            {status.validation_dataset_path}
          </div>
        )}
    </div>
  );
};
