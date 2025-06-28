import { fetchEvaluationStatus } from '@/features/service-starter/evaluation-service';
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
    <div className="space-y-2">
      <div>
        <span className="font-semibold">Status:</span> {status.status}
      </div>
      <div>
        <span className="font-semibold">Progress:</span>{' '}
        {Math.round(status.progress * 100)}%
      </div>
      <div>
        <span className="font-semibold">Task ID:</span> {status.task_id}
      </div>
      <div>
        <span className="font-semibold">Created at:</span> {status.created_at}
      </div>
      <div>
        <span className="font-semibold">Updated at:</span> {status.updated_at}
      </div>
      {status.end_date && (
        <div>
          <span className="font-semibold">End date:</span> {status.end_date}
        </div>
      )}
      {status.error_msg && (
        <div className="text-red-600">
          <span className="font-semibold">Error:</span> {status.error_msg}
        </div>
      )}
      {status.evaluation_summary && (
        <div>
          <span className="font-semibold">Summary:</span>{' '}
          {status.evaluation_summary}
        </div>
      )}
      {status.evaluation_metrics && (
        <div>
          <span className="font-semibold">Evaluation metrics:</span>
          <pre className="bg-muted overflow-x-auto rounded p-2 text-xs">
            {JSON.stringify(status.evaluation_metrics, undefined, 2)}
          </pre>
        </div>
      )}
      {status.baseline_metrics && (
        <div>
          <span className="font-semibold">Baseline metrics:</span>
          <pre className="bg-muted overflow-x-auto rounded p-2 text-xs">
            {JSON.stringify(status.baseline_metrics, undefined, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default EvaluationData;
