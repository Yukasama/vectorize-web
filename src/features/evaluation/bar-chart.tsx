'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface BarChartProps {
  baselineMetrics?: Record<string, number>;
  evaluationMetrics?: Record<string, number>;
}

export const EvaluationScatterChart = ({
  baselineMetrics,
  evaluationMetrics,
}: BarChartProps) => {
  // Show message if no metrics are available
  if (!evaluationMetrics && !baselineMetrics) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Metrics Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            No metrics available.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show comparison chart if both evaluation and baseline metrics are available
  if (evaluationMetrics && baselineMetrics) {
    const keys = Object.keys(evaluationMetrics).filter(
      (k) =>
        k !== 'num_samples' &&
        typeof evaluationMetrics[k] === 'number' &&
        typeof baselineMetrics[k] === 'number',
    );

    const chartData = keys.map((k) => ({
      baseline: baselineMetrics[k],
      evaluation: evaluationMetrics[k],
      metric: k,
    }));

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Metrics Comparison: Baseline vs. Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={320} width="100%">
            <BarChart
              data={chartData}
              margin={{ bottom: 0, left: 0, right: 24, top: 16 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="metric"
                tick={{ fontSize: 12 }}
                tickFormatter={(value: string) =>
                  value.length > 20 ? `${value.slice(0, 20)}...` : value
                }
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="baseline" fill="#3b82f6" name="Baseline" />
              <Bar dataKey="evaluation" fill="#10b981" name="Evaluation" />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-muted-foreground mt-2 text-xs">
            <b>Metrics:</b> {keys.join(', ')}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show chart for evaluation metrics only
  if (evaluationMetrics) {
    const keys = Object.keys(evaluationMetrics).filter(
      (k) => k !== 'num_samples' && typeof evaluationMetrics[k] === 'number',
    );

    const chartData = keys.map((k) => ({
      evaluation: evaluationMetrics[k],
      metric: k,
    }));

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Evaluation Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={320} width="100%">
            <BarChart
              data={chartData}
              margin={{ bottom: 0, left: 0, right: 24, top: 16 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="metric"
                tick={{ fontSize: 12 }}
                tickFormatter={(value: string) =>
                  value.length > 15 ? `${value.slice(0, 15)}...` : value
                }
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="evaluation" fill="#10b981" name="Evaluation" />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-muted-foreground mt-2 text-xs">
            <b>Metrics:</b> {keys.join(', ')}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show chart for baseline metrics only
  if (baselineMetrics) {
    const keys = Object.keys(baselineMetrics).filter(
      (k) => k !== 'num_samples' && typeof baselineMetrics[k] === 'number',
    );

    const chartData = keys.map((k) => ({
      baseline: baselineMetrics[k],
      metric: k,
    }));

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Baseline Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={320} width="100%">
            <BarChart
              data={chartData}
              margin={{ bottom: 0, left: 0, right: 24, top: 16 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="metric"
                tick={{ fontSize: 12 }}
                tickFormatter={(value: string) =>
                  value.length > 15 ? `${value.slice(0, 15)}...` : value
                }
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="baseline" fill="#3b82f6" name="Baseline" />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-muted-foreground mt-2 text-xs">
            <b>Metrics:</b> {keys.join(', ')}
          </div>
        </CardContent>
      </Card>
    );
  }
};

export default EvaluationScatterChart;
