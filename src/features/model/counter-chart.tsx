import { AreaChart } from '@/components/ui/area-chart';
import { client } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';

interface CounterChartProps {
  modelTag: string;
}

const fetchModelStats = async (
  modelTag: string,
): Promise<Record<string, number>> => {
  try {
    const { data } = await client.get<Record<string, number>>(
      `/embeddings/counter/${modelTag}`,
    );
    if (
      typeof data === 'object' &&
      !Array.isArray(data) &&
      Object.values(data).every((v) => typeof v === 'number')
    ) {
      return data;
    }
    throw new Error('Invalid data format');
  } catch {
    throw new Error('Failed to fetch model stats');
  }
};

export const CounterChart = ({ modelTag }: CounterChartProps) => {
  const { data, error, isLoading } = useQuery({
    enabled: !!modelTag,
    queryFn: () => fetchModelStats(modelTag),
    queryKey: ['model-stats', modelTag],
  });

  const chartData = data
    ? Object.entries(data).map(([date, value]) => ({ date, value }))
    : [];

  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm">Loading chart...</div>
    );
  }
  if (error) {
    return <div className="text-destructive text-sm">Error loading chart</div>;
  }
  if (chartData.length === 0) {
    return <div className="text-muted-foreground text-sm">No data</div>;
  }

  return <AreaChart data={chartData} />;
};
