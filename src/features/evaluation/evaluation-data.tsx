import { fetchEvaluationStatus } from '@/features/service-starter/evaluation-service';
import { TASKS_STATUS_MAP } from '@/features/tasks/config/mappers';
import { useQuery } from '@tanstack/react-query';

interface EvaluationDataProps {
  evaluationId: string;
}

export const EvaluationData = ({ evaluationId }: EvaluationDataProps) => {
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
              {status.created_at.slice(0, 16)}
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
                {status.end_date}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Model and Dataset information in cards */}
        <div className="space-y-3">
          {status.model_tag && (
            <a
              className="border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground block rounded-lg border p-3 transition-colors"
              href={`/model/${status.model_tag}`}
            >
              <div className="text-muted-foreground mb-1 text-xs font-medium">
                Model
              </div>
              <div className="text-sm font-medium break-all">
                {status.model_tag.length > 60
                  ? `${status.model_tag.slice(0, 60)}...`
                  : status.model_tag}
              </div>
            </a>
          )}
          {status.baseline_model_tag && (
            <a
              className="border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground block rounded-lg border p-3 transition-colors"
              href={`/model/${status.baseline_model_tag}`}
            >
              <div className="text-muted-foreground mb-1 text-xs font-medium">
                Baseline Model
              </div>
              <div className="text-sm font-medium break-all">
                {status.baseline_model_tag.length > 60
                  ? `${status.baseline_model_tag.slice(0, 60)}...`
                  : status.baseline_model_tag}
              </div>
            </a>
          )}
          {status.dataset_info && (
            <div className="space-y-2">
              {status.dataset_info.split(',').map((id: string) => {
                const trimmed = id.trim();
                const cleanId = trimmed.replace(/^Dataset:\s*/, '');
                return (
                  <a
                    className="border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground block rounded-lg border p-3 transition-colors"
                    href={`/dataset/${cleanId}`}
                    key={trimmed}
                  >
                    <div className="text-muted-foreground mb-1 text-xs font-medium">
                      Dataset
                    </div>
                    <div className="text-sm font-medium break-all">
                      {cleanId.length > 60
                        ? `${cleanId.slice(0, 60)}...`
                        : cleanId}
                    </div>
                  </a>
                );
              })}
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
