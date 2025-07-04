import { fetchEvaluationStatus } from '@/features/service-starter/evaluation-service';
import { TASKS_STATUS_MAP } from '@/features/tasks/config/mappers';
import { formatDate } from '@/features/tasks/lib/date-helpers';
import { useQuery } from '@tanstack/react-query';

interface EvaluationDataProps {
  baselineId?: string;
  evaluationId: string;
  modelId?: string;
}
interface EvaluationStatusResponseWithDatasets {
  baseline_metrics?: null | Record<string, unknown>;
  baseline_model_tag?: null | string;
  created_at: string;
  end_date?: null | string;
  error_msg?: null | string;
  evaluation_dataset_ids?: string[];
  evaluation_metrics?: null | Record<string, unknown>;
  evaluation_summary?: null | string;
  model_tag?: null | string;
  progress: number;
  status: string;
  task_id: string;
  updated_at: string;
}

export const EvaluationData = ({
  baselineId,
  evaluationId,
  modelId,
}: EvaluationDataProps) => {
  const {
    data: status,
    error,
    isLoading,
  } = useQuery({
    enabled: !!evaluationId,
    queryFn: () => fetchEvaluationStatus(evaluationId),
    queryKey: ['evaluation-status', evaluationId],
  });

  if (isLoading) {
    return (
      <div className="text-muted-foreground">Loading evaluation status...</div>
    );
  }
  if (error || !status) {
    return (
      <div className="text-destructive">Error loading evaluation status</div>
    );
  }

  // Debug: Log das gesamte status-Objekt und dataset_info
  console.log('EvaluationData status:', status);
  console.log('EvaluationData dataset_info:', status.dataset_info);

  const statusWithDatasets = status as EvaluationStatusResponseWithDatasets;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column - Status information in a card */}
        <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
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
            <div>
              <span className="font-semibold">Progress:</span>{' '}
              {Math.round(status.progress * 100)}%
            </div>
            <div>
              <span className="font-semibold">Task ID:</span> {status.task_id}
            </div>
            <div>
              <span className="font-semibold">Created at:</span>{' '}
              {formatDate(status.created_at)}
            </div>
            {status.evaluation_summary && (
              <div>
                <span className="font-semibold">Summary:</span>{' '}
                {status.evaluation_summary}
              </div>
            )}
            {status.end_date && (
              <div>
                <span className="font-semibold">End date:</span>{' '}
                {formatDate(status.end_date)}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Model and Dataset information in cards */}
        <div className="space-y-3">
          {baselineId && (
            <a
              className="border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground block rounded-lg border p-3 transition-colors"
              href={`/model/${baselineId}`}
            >
              <div className="text-muted-foreground mb-1 text-xs font-medium">
                Baseline Model
              </div>
              <div className="text-sm font-medium break-all">
                {String(baselineId).length > 60
                  ? `${String(baselineId).slice(0, 60)}...`
                  : String(baselineId)}
              </div>
            </a>
          )}
          {modelId && (
            <a
              className="border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground block rounded-lg border p-3 transition-colors"
              href={`/model/${modelId}`}
            >
              <div className="text-muted-foreground mb-1 text-xs font-medium">
                Model
              </div>
              <div className="text-sm font-medium break-all">
                {String(modelId).length > 60
                  ? `${String(modelId).slice(0, 60)}...`
                  : String(modelId)}
              </div>
            </a>
          )}
          {statusWithDatasets.evaluation_dataset_ids &&
          Array.isArray(statusWithDatasets.evaluation_dataset_ids) &&
          statusWithDatasets.evaluation_dataset_ids.length > 0 ? (
            <div className="space-y-2">
              {statusWithDatasets.evaluation_dataset_ids.map((id: string) => (
                <a
                  className="border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground block rounded-lg border p-3 transition-colors"
                  href={`/dataset/${id}`}
                  key={id}
                >
                  <div className="text-muted-foreground mb-1 text-xs font-medium">
                    Dataset
                  </div>
                  <div className="text-sm font-medium break-all">
                    {id.length > 60 ? `${id.slice(0, 60)}...` : id}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">
              Kein Datensatz verknüpft
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {status.error_msg && (
        <div className="text-red-600">
          <span className="font-semibold">Error:</span> {status.error_msg}
        </div>
      )}
    </div>
  );
};

export default EvaluationData;
