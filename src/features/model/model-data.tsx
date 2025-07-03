import { fetchModelByTag } from '@/features/sidebar/services/model-service';
import { useQuery } from '@tanstack/react-query';
import { CounterChart } from './counter-chart';
import { ModelTaskList } from './model-task-list';

interface ModelDataProps {
  modelTag: string;
}

const getSourceDisplayName = (source: string): string => {
  switch (source) {
    case 'G': {
      return 'GitHub';
    }
    case 'H': {
      return 'Hugging Face';
    }
    case 'L': {
      return 'Local';
    }
    default: {
      return source;
    }
  }
};

export const ModelData = ({ modelTag }: ModelDataProps) => {
  const {
    data: model,
    error,
    isLoading,
  } = useQuery({
    enabled: !!modelTag,
    queryFn: () => fetchModelByTag(modelTag),
    queryKey: ['model', modelTag],
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading model data...</div>;
  }
  if (error) {
    return <div className="text-destructive">Error loading model data</div>;
  }
  if (!model) {
    return <div className="text-destructive">Model not found</div>;
  }

  const truncatedName =
    model.name && model.name.length > 50
      ? `${model.name.slice(0, 50)}...`
      : model.name;
  const truncatedTag =
    model.model_tag && model.model_tag.length > 50
      ? `${model.model_tag.slice(0, 50)}...`
      : model.model_tag;

  return (
    <div className="space-y-8">
      {/* Model Details Section */}
      <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
        <div className="space-y-3">
          <div>
            <span className="font-semibold">Name:</span> {truncatedName}
          </div>
          <div>
            <span className="font-semibold">Model Tag:</span> {truncatedTag}
          </div>
          <div>
            <span className="font-semibold">Source:</span>{' '}
            {getSourceDisplayName(model.source)}
          </div>
          <div>
            <span className="font-semibold">Created at:</span>{' '}
            {model.created_at}
          </div>
        </div>
      </div>

      {/* Model Chart Section */}
      <div>
        <CounterChart modelTag={modelTag} />
      </div>

      {/* Model Tasks Section */}
      <div>
        <h2 className="mb-2 text-xl font-semibold">Tasks for this Model</h2>
        <ModelTaskList modelTag={modelTag} />
      </div>
    </div>
  );
};

export default ModelData;
