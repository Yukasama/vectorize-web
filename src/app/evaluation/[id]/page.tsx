// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { EvaluationScatterChart } from '@/features/evaluation/bar-chart';
import { fetchEvaluationStatus } from '@/features/service-starter/evaluation-service';
import { AppSidebar } from '@/features/sidebar/app-sidebar';
import { fetchDatasetById } from '@/features/sidebar/services/dataset-service';
import { fetchModelByTag } from '@/features/sidebar/services/model-service';
import { ThemeToggle } from '@/features/theme/theme-toggle';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  BarChart3,
  Bot,
  Calendar,
  Check,
  Copy,
  Database,
  ExternalLink,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Helper to filter only numeric metrics from an object
const filterMetrics = (obj: unknown): Record<string, number> | undefined => {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const entries = Object.entries(obj).filter(
      ([, v]) => typeof v === 'number',
    );
    if (entries.length > 0) {
      return Object.fromEntries(entries) as Record<string, number>;
    }
  }
  return undefined;
};

// Helper to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Helper to format metric values based on their key
const formatMetricValue = (key: string, value: number): string => {
  if (key === 'num_samples') {
    return value.toString();
  }
  return value.toFixed(4);
};

// Helper to get status color and label
const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': {
      return {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Completed',
      };
    }
    case 'failed': {
      return {
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Failed',
      };
    }
    case 'pending': {
      return {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Pending',
      };
    }
    case 'running': {
      return {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Running',
      };
    }
    default: {
      return {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        label: status,
      };
    }
  }
};

// Helper to format metric names from snake_case to Title Case
const formatMetricName = (name: string): string => {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Enhanced info card component for models and datasets
const InfoCard = ({
  color,
  href,
  icon: Icon,
  id,
  name,
  subtitle,
  title,
}: {
  color: string;
  href: string;
  icon: any;
  id: string;
  name?: string;
  subtitle?: string;
  title: string;
}) => {
  return (
    <Link href={href}>
      <Card
        className={cn(
          'group relative cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md',
          color,
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="from-primary/10 to-primary/5 flex-shrink-0 rounded-lg bg-gradient-to-br p-2">
              <Icon className="text-primary h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {title}
                </span>
                <ExternalLink className="text-muted-foreground h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              {name && (
                <h4 className="mb-1 truncate text-sm font-semibold">{name}</h4>
              )}
              <p className="text-muted-foreground font-mono text-xs break-all">
                {id.length > 40 ? `${id.slice(0, 40)}...` : id}
              </p>
              {subtitle && (
                <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Dataset info card component - matches InfoCard style exactly
const DatasetInfoCard = ({
  datasets,
}: {
  datasets: { id: string; name?: string }[];
}) => {
  // If only one dataset, use the same style as model cards
  if (datasets.length === 1) {
    const dataset = datasets[0];
    return (
      <InfoCard
        color="border-l-4 border-l-purple-500"
        href={`/dataset/${dataset.id}`}
        icon={Database}
        id={dataset.id}
        name={dataset.name}
        title="Dataset"
      />
    );
  }

  // Multiple datasets - use scrollable content inside the same card structure
  return (
    <Card className="group relative cursor-pointer overflow-hidden border-l-4 border-l-purple-500 transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="from-primary/10 to-primary/5 flex-shrink-0 rounded-lg bg-gradient-to-br p-2">
            <Database className="text-primary h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Datasets ({datasets.length})
              </span>
            </div>
            {/* Scrollable dataset list */}
            <div className="max-h-20 space-y-1 overflow-y-auto">
              {datasets.map((dataset) => (
                <Link href={`/dataset/${dataset.id}`} key={dataset.id}>
                  <div className="group/item hover:bg-muted/50 rounded p-1 transition-colors duration-150">
                    {dataset.name && (
                      <div className="truncate text-sm font-medium">
                        {dataset.name}
                      </div>
                    )}
                    <div className="text-muted-foreground flex items-center gap-1 font-mono text-xs break-all">
                      {dataset.id.length > 35
                        ? `${dataset.id.slice(0, 35)}...`
                        : dataset.id}
                      <ExternalLink className="text-muted-foreground h-2 w-2 opacity-0 transition-opacity group-hover/item:opacity-100" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced metric card component
const MetricCard = ({
  color,
  icon: Icon,
  metrics,
  title,
}: {
  color: string;
  icon: any;
  metrics: Record<string, any>;
  title: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(metrics, undefined, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate key metrics for preview - prioritize specific metrics, put num_samples last
  const priorityMetrics = ['spearman_correlation'];
  const numericMetrics = Object.entries(metrics).filter(
    ([, v]) => typeof v === 'number',
  );

  // Get priority metrics first
  const priorityEntries = priorityMetrics
    .map((key) => numericMetrics.find(([k]) => k === key))
    .filter(Boolean) as [string, number][];

  // Get other metrics (excluding priority and num_samples)
  const otherEntries = numericMetrics
    .filter(([key]) => !priorityMetrics.includes(key) && key !== 'num_samples')
    .slice(0, 3); // Leave room for num_samples at the end

  // Get num_samples if it exists
  const numSamplesEntry = numericMetrics.find(([key]) => key === 'num_samples');

  // Combine all metrics with num_samples at the end
  const topMetrics = [
    ...priorityEntries,
    ...otherEntries,
    ...(numSamplesEntry ? [numSamplesEntry] : []),
  ].slice(0, 5) as [string, number][];

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-shadow duration-200 hover:shadow-md',
        color,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="from-primary/10 to-primary/5 rounded-lg bg-gradient-to-br p-2">
              <Icon className="text-primary h-5 w-5" />
            </div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <Button
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={handleCopy}
            size="sm"
            variant="ghost"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Key metrics preview */}
        {topMetrics.length > 0 && (
          <div className="space-y-2">
            {topMetrics.map(([key, value]) => (
              <div
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors duration-150"
                key={key}
              >
                <span className="truncate pr-2 text-sm font-medium">
                  {formatMetricName(key)}
                </span>
                <Badge className="font-mono text-xs" variant="secondary">
                  {typeof value === 'number'
                    ? formatMetricValue(key, value)
                    : value}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Extended interface to include evaluation_dataset_ids
interface EvaluationStatusResponseExtended {
  baseline_metrics?: null | Record<string, unknown>;
  baseline_model_tag?: null | string;
  created_at: string;
  dataset_info?: null | string;
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

export default function EvaluationDetailPage() {
  // Get evaluation ID from URL params
  const params = useParams();
  const evaluationId = typeof params.id === 'string' ? params.id : '';

  // Fetch evaluation status using React Query
  const { data: status, isLoading } = useQuery({
    enabled: !!evaluationId,
    queryFn: () => fetchEvaluationStatus(evaluationId),
    queryKey: ['evaluation-status', evaluationId],
  });

  // State for resolved model and baseline info
  const [modelInfo, setModelInfo] = useState<{ id?: string; name?: string }>();
  const [baselineInfo, setBaselineInfo] = useState<{
    id?: string;
    name?: string;
  }>();
  const [datasetInfo, setDatasetInfo] = useState<
    { id: string; name?: string }[]
  >([]);

  // Resolve model, baseline, and dataset info when status changes
  useEffect(() => {
    const resolveInfo = async () => {
      if (status?.model_tag) {
        const model = await fetchModelByTag(status.model_tag);
        setModelInfo({ id: model?.id, name: model?.name });
      } else {
        setModelInfo(undefined);
      }

      if (status?.baseline_model_tag) {
        const baseline = await fetchModelByTag(status.baseline_model_tag);
        setBaselineInfo({ id: baseline?.id, name: baseline?.name });
      } else {
        setBaselineInfo(undefined);
      }

      // Resolve dataset info from evaluation_dataset_ids
      const statusExtended = status as EvaluationStatusResponseExtended;
      if (
        statusExtended.evaluation_dataset_ids &&
        Array.isArray(statusExtended.evaluation_dataset_ids)
      ) {
        const datasets = await Promise.all(
          statusExtended.evaluation_dataset_ids.map(async (id: string) => {
            try {
              const dataset = await fetchDatasetById(id);
              return { id, name: dataset?.name };
            } catch {
              return { id };
            }
          }),
        );
        setDatasetInfo(datasets);
      } else {
        setDatasetInfo([]);
      }
    };

    if (status) {
      void resolveInfo();
    }
  }, [status]);

  // Prepare evaluation name for header
  const evaluationNameContent = (
    <span className="text-muted-foreground flex items-center gap-2 text-sm">
      <Target className="h-4 w-4" />
      Evaluation: {evaluationId.slice(0, 8)}...
    </span>
  );

  const evaluationMetrics = filterMetrics(status?.evaluation_metrics);
  const baselineMetrics = filterMetrics(status?.baseline_metrics);
  const statusInfo = status ? getStatusInfo(status.status) : undefined;

  // Check if we should show the chart (has data or is still loading)
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const shouldShowChart = isLoading || evaluationMetrics || baselineMetrics;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              className="mr-2 data-[orientation=vertical]:h-4"
              orientation="vertical"
            />
            {evaluationNameContent}
          </div>
          <ThemeToggle />
        </header>

        <Separator className="mb-4" />

        <main className="flex-1 space-y-8 p-6">
          {/* Hero section with evaluation overview */}
          <Card className="relative overflow-hidden">
            <div className="from-primary/5 to-secondary/5 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent" />
            <CardHeader className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="mb-2 text-2xl font-bold">
                    Evaluation Overview
                  </CardTitle>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {status?.created_at && formatDate(status.created_at)}
                    </div>
                    {statusInfo && (
                      <Badge className={cn('text-xs', statusInfo.color)}>
                        <Activity className="mr-1 h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    )}
                    {status?.progress !== undefined && (
                      <span>
                        Progress: {Math.round(status.progress * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              {status?.evaluation_summary && (
                <p className="text-muted-foreground mb-4">
                  {status.evaluation_summary}
                </p>
              )}
              {status?.error_msg && (
                <div className="bg-destructive/10 border-destructive/20 mb-4 rounded-lg border p-3">
                  <p className="text-destructive text-sm">
                    <strong>Error:</strong> {status.error_msg}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Models and Datasets Info */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="from-secondary/20 to-secondary/10 rounded-lg bg-gradient-to-br p-2">
                <Bot className="text-secondary-foreground h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Resources</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Model */}
              {modelInfo?.id && (
                <InfoCard
                  color="border-l-4 border-l-green-500"
                  href={`/model/${modelInfo.id}`}
                  icon={Bot}
                  id={modelInfo.id}
                  name={modelInfo.name}
                  title="Model"
                />
              )}

              {/* Baseline Model */}
              {baselineInfo?.id && (
                <InfoCard
                  color="border-l-4 border-l-blue-500"
                  href={`/model/${baselineInfo.id}`}
                  icon={Bot}
                  id={baselineInfo.id}
                  name={baselineInfo.name}
                  title="Baseline Model"
                />
              )}

              {/* Dataset List */}
              {datasetInfo.length > 0 && (
                <DatasetInfoCard datasets={datasetInfo} />
              )}
            </div>
          </div>

          {/* Enhanced chart section - only show if we have data or are loading */}
          {shouldShowChart && (
            <Card className="border-primary/10 relative overflow-hidden border-2 shadow-lg">
              <div className="from-primary/5 to-secondary/5 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="from-primary/20 to-primary/10 rounded-xl bg-gradient-to-br p-3">
                    <BarChart3 className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
                      Performance Metrics
                    </CardTitle>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Side-by-side comparison of key performance indicators
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3">
                      <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      <span className="text-muted-foreground text-sm">
                        Loading metrics...
                      </span>
                    </div>
                  </div>
                ) : (
                  <EvaluationScatterChart
                    baselineMetrics={baselineMetrics}
                    evaluationMetrics={evaluationMetrics}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Enhanced metrics section */}
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="from-secondary/20 to-secondary/10 rounded-lg bg-gradient-to-br p-2">
                <TrendingUp className="text-secondary-foreground h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Detailed Metrics</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {status?.evaluation_metrics && (
                <MetricCard
                  color="border-l-4 border-l-green-500 hover:border-l-green-400"
                  icon={Target}
                  metrics={status.evaluation_metrics}
                  title="Evaluation Results"
                />
              )}

              {status?.baseline_metrics && (
                <MetricCard
                  color="border-l-4 border-l-blue-500 hover:border-l-blue-400"
                  icon={Zap}
                  metrics={status.baseline_metrics}
                  title="Baseline Comparison"
                />
              )}
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {[1, 2].map((i) => (
                  <Card className="animate-pulse" key={i}>
                    <CardHeader>
                      <div className="bg-muted h-6 w-1/2 rounded" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[1, 2, 3].map((j) => (
                          <div
                            className="bg-muted h-4 w-full rounded"
                            key={j}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty state - only show if not loading and no metrics */}
            {!isLoading &&
              !status?.evaluation_metrics &&
              !status?.baseline_metrics && (
                <Card className="py-12 text-center">
                  <CardContent>
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-muted/50 rounded-full p-4">
                        <BarChart3 className="text-muted-foreground h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          No Metrics Available
                        </h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                          Metrics will appear here once the evaluation is
                          complete.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
