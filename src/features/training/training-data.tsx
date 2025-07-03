import { fetchTrainingById } from '@/features/service-starter/training-service';
import { TASKS_STATUS_MAP } from '@/features/tasks/config/mappers';
import { useQuery } from '@tanstack/react-query';
import { TrainingTaskList } from './training-task-list';

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
    <div className="space-y-6">
      {/* Training Status Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border-border bg-card text-card-foreground rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">Training Status</h3>
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Status:</span>{' '}
              <span
                className={`inline-flex items-center gap-1 text-sm ${
                  TASKS_STATUS_MAP[
                    status.status as keyof typeof TASKS_STATUS_MAP
                  ].color || ''
                }`}
              >
                {TASKS_STATUS_MAP[
                  status.status as keyof typeof TASKS_STATUS_MAP
                ].label || status.status}
              </span>
            </div>
            {status.started_at && (
              <div>
                <span className="font-semibold">Started at:</span>{' '}
                {new Date(status.started_at).toLocaleString()}
              </div>
            )}
            {status.finished_at && (
              <div>
                <span className="font-semibold">Finished at:</span>{' '}
                {new Date(status.finished_at).toLocaleString()}
              </div>
            )}
            {typeof status.epoch === 'number' && (
              <div>
                <span className="font-semibold">Epoch:</span> {status.epoch}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Model and performance information */}
        <div className="space-y-3">
          {status.model_tag && (
            <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
              <div className="text-muted-foreground mb-1 text-xs font-medium">
                Model Tag
              </div>
              <div className="text-sm font-medium break-all">
                {status.model_tag.length > 60
                  ? `${status.model_tag.slice(0, 60)}...`
                  : status.model_tag}
              </div>
            </div>
          )}
          {typeof status.trained_model_id === 'string' &&
            status.trained_model_id && (
              <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
                <div className="text-muted-foreground mb-1 text-xs font-medium">
                  Trained Model ID
                </div>
                <div className="text-sm font-medium break-all">
                  {status.trained_model_id}
                </div>
              </div>
            )}
          {status.output_dir && (
            <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
              <div className="text-muted-foreground mb-1 text-xs font-medium">
                Output Directory
              </div>
              <div className="text-sm font-medium break-all">
                {status.output_dir}
              </div>
            </div>
          )}
          <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
            <div className="text-muted-foreground mb-1 text-xs font-medium">
              Validation Dataset Path
            </div>
            <div className="text-sm font-medium break-all">
              {typeof status.validation_dataset_path === 'string' &&
              status.validation_dataset_path ? (
                status.validation_dataset_path
              ) : (
                <span className="text-muted-foreground">None specified</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics Section */}
      {(typeof status.train_runtime === 'number' ||
        typeof status.train_samples_per_second === 'number' ||
        typeof status.train_steps_per_second === 'number' ||
        typeof status.train_loss === 'number') && (
        <div className="border-border bg-card text-card-foreground rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">Performance Metrics</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {typeof status.train_runtime === 'number' && (
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-muted-foreground mb-1 text-xs font-medium">
                  Train Runtime
                </div>
                <div className="text-lg font-semibold">
                  {status.train_runtime}s
                </div>
              </div>
            )}
            {typeof status.train_samples_per_second === 'number' && (
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-muted-foreground mb-1 text-xs font-medium">
                  Samples/sec
                </div>
                <div className="text-lg font-semibold">
                  {status.train_samples_per_second.toFixed(2)}
                </div>
              </div>
            )}
            {typeof status.train_steps_per_second === 'number' && (
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-muted-foreground mb-1 text-xs font-medium">
                  Steps/sec
                </div>
                <div className="text-lg font-semibold">
                  {status.train_steps_per_second.toFixed(2)}
                </div>
              </div>
            )}
            {typeof status.train_loss === 'number' && (
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-muted-foreground mb-1 text-xs font-medium">
                  Train Loss
                </div>
                <div className="text-lg font-semibold">
                  {status.train_loss.toFixed(4)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Section */}
      {status.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
          <h3 className="mb-2 text-lg font-semibold text-red-900">Error</h3>
          <p className="text-sm">{status.error}</p>
        </div>
      )}

      {/* Training History Section */}
      {status.model_tag && (
        <div className="border-border bg-card text-card-foreground rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">Training History</h3>
          <TrainingTaskList
            currentTrainingId={status.id}
            modelTag={status.model_tag}
          />
        </div>
      )}
    </div>
  );
};
