import { fetchDatasetById } from '@/features/sidebar/services/dataset-service';
import { formatDate } from '@/features/tasks/lib/date-helpers';
import { useQuery } from '@tanstack/react-query';
import { DatasetTaskList } from './dataset-task-list';

interface DatasetDataProps {
  datasetId: string;
}

export const DatasetData = ({ datasetId }: DatasetDataProps) => {
  const {
    data: dataset,
    error,
    isLoading,
  } = useQuery({
    enabled: !!datasetId,
    queryFn: () => fetchDatasetById(datasetId),
    queryKey: ['dataset-details', datasetId],
  });

  if (isLoading) {
    return (
      <div className="text-muted-foreground">Loading dataset details...</div>
    );
  }
  if (error || !dataset) {
    return (
      <div className="text-destructive">Error loading dataset details</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dataset Details Section */}
      <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
        <div className="space-y-3">
          <div>
            <span className="font-semibold">Name:</span> {dataset.name}
          </div>
          <div>
            <span className="font-semibold">ID:</span> {dataset.id}
          </div>
          {dataset.file_name && (
            <div>
              <span className="font-semibold">File name:</span>{' '}
              {dataset.file_name}
            </div>
          )}
          {dataset.rows && (
            <div>
              <span className="font-semibold">Rows:</span> {dataset.rows}
            </div>
          )}
          {dataset.classification && (
            <div>
              <span className="font-semibold">Classification:</span>{' '}
              {dataset.classification}
            </div>
          )}
          {dataset.created_at && (
            <div>
              <span className="font-semibold">Created at:</span>{' '}
              {formatDate(dataset.created_at)}
            </div>
          )}
        </div>
      </div>

      {/* Dataset Task History Section */}
      <div>
        <DatasetTaskList datasetId={datasetId} />
      </div>
    </div>
  );
};
