'use client';

import {
  fetchTrainingById,
  TrainingStatusResponse,
} from '@/features/service-starter/training-service';
import { TASKS_STATUS_MAP } from '@/features/tasks/config/mappers';
import { formatDate } from '@/features/tasks/lib/date-helpers';
import { useQuery } from '@tanstack/react-query';

/**
 * Training status and metrics display for a given training run.
 * Fetches, parses, and presents training details and errors.
 */

interface TrainingDataProps {
  trainingId: string;
}

// Extend TrainingStatusResponse to include optional properties if not present in the base type
type TrainingStatusWithExtras = TrainingStatusResponse & {
  baseline_model_id?: string;
  created_at?: string;
  train_dataset_ids?: string | string[];
};

export const TrainingData = ({ trainingId }: TrainingDataProps) => {
  // Fetch training status by ID
  const { data, error, isLoading } = useQuery({
    enabled: !!trainingId,
    queryFn: () => fetchTrainingById(trainingId),
    queryKey: ['training-status', trainingId],
  });

  const status = data as TrainingStatusWithExtras | undefined;

  // Extract train dataset IDs as array
  let trainDatasetIds: string[] = [];
  if (status) {
    if (Array.isArray(status.train_dataset_ids)) {
      trainDatasetIds = status.train_dataset_ids;
    } else if (
      typeof status.train_dataset_ids === 'string' &&
      status.train_dataset_ids
    ) {
      trainDatasetIds = [status.train_dataset_ids];
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="text-muted-foreground">Loading training details...</div>
    );
  }
  // Error state
  if (error || !status) {
    return (
      <div className="text-destructive">Error loading training details</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Training Status Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border-border bg-card text-card-foreground rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">Training Details</h3>
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
            {/* Show creation date if available */}
            {status.created_at && (
              <div>
                <span className="font-semibold">Created at:</span>{' '}
                {formatDate(status.created_at)}
              </div>
            )}
            {/* Show epoch if available */}
            {typeof status.epoch === 'number' && (
              <div>
                <span className="font-semibold">Epoch:</span> {status.epoch}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Model and performance information */}
        <div className="space-y-3">
          {/* Model tag info */}
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
          {/* Trained model ID info */}
          {typeof status.trained_model_id === 'string' &&
            status.trained_model_id && (
              <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
                <div className="text-muted-foreground mb-1 text-xs font-medium">
                  Trained Model ID
                </div>
                <div className="text-sm font-medium break-all">
                  <a
                    className="text-primary hover:text-primary/80 underline"
                    href={`/model/${encodeURIComponent(status.trained_model_id)}`}
                  >
                    {status.trained_model_id}
                  </a>
                </div>
              </div>
            )}
          {/* Baseline model info */}
          {typeof status.baseline_model_id === 'string' &&
            status.baseline_model_id && (
              <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
                <div className="text-muted-foreground mb-1 text-xs font-medium">
                  Base Model ID
                </div>
                <div className="text-sm font-medium break-all">
                  <a
                    className="text-primary hover:text-primary/80 underline"
                    href={`/model/${encodeURIComponent(status.baseline_model_id)}`}
                  >
                    {status.baseline_model_id}
                  </a>
                </div>
              </div>
            )}
          {/* Output directory info */}
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
          {/* Training dataset(s) info */}
          <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
            <div className="text-muted-foreground mb-1 text-xs font-medium">
              Training Dataset(s)
            </div>
            <div
              className="flex flex-col gap-1 overflow-y-auto text-sm font-medium break-all"
              style={{ maxHeight: '8.5em' }}
            >
              {trainDatasetIds.length > 0 ? (
                trainDatasetIds.map((id: string) => (
                  <a
                    className="text-primary hover:text-primary/80 underline"
                    href={`/dataset/${encodeURIComponent(id)}`}
                    key={id}
                  >
                    {id}
                  </a>
                ))
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
            {/* Show runtime if available */}
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
            {/* Show samples/sec if available */}
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
            {/* Show steps/sec if available */}
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
            {/* Show train loss if available */}
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
    </div>
  );
};
