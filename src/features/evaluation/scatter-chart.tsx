'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ScatterChartProps {
  baselineMetrics?: Record<string, number>;
  evaluationMetrics?: Record<string, number>;
}

export const EvaluationScatterChart = ({
  baselineMetrics,
  evaluationMetrics,
}: ScatterChartProps) => {
  if (!evaluationMetrics && !baselineMetrics) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Scatterplot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            No metrics available.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (evaluationMetrics && baselineMetrics) {
    const keys = Object.keys(evaluationMetrics).filter(
      (k) =>
        k !== 'num_samples' &&
        typeof evaluationMetrics[k] === 'number' &&
        typeof baselineMetrics[k] === 'number',
    );
    const data = keys.map((k) => ({
      metric: k,
      x: baselineMetrics[k],
      y: evaluationMetrics[k],
    }));
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Scatterplot: Baseline vs. Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={320} width="100%">
            <ScatterChart margin={{ bottom: 0, left: 0, right: 24, top: 16 }}>
              <XAxis
                dataKey="x"
                label={{
                  offset: -8,
                  position: 'insideBottom',
                  value: 'Baseline',
                }}
                name="Baseline"
                tick={{ fontSize: 12 }}
                type="number"
              />
              <YAxis
                dataKey="y"
                label={{
                  angle: -90,
                  position: 'insideLeft',
                  value: 'Evaluation',
                }}
                name="Evaluation"
                tick={{ fontSize: 12 }}
                type="number"
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(_, __, props) => {
                  const p = props as {
                    payload: { metric: string; x: number; y: number };
                  };
                  return `${p.payload.metric}: (${p.payload.x}, ${p.payload.y})`;
                }}
              />
              <Scatter
                data={data}
                fill="#2563eb"
                name="Metrics"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="text-muted-foreground mt-2 text-xs">
            <b>Metrics:</b> {keys.join(', ')}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Wenn nur evaluationMetrics vorhanden, plotte gegen Index
  if (evaluationMetrics) {
    const keys = Object.keys(evaluationMetrics).filter(
      (k) => k !== 'num_samples' && typeof evaluationMetrics[k] === 'number',
    );
    const data = keys.map((k, i) => ({
      metric: k,
      x: i + 1,
      y: evaluationMetrics[k],
    }));
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Evaluation Metrics (Y) vs. Index (X)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={320} width="100%">
            <ScatterChart margin={{ bottom: 0, left: 0, right: 24, top: 16 }}>
              <XAxis
                allowDecimals={false}
                dataKey="x"
                label={{
                  offset: -8,
                  position: 'insideBottom',
                  value: 'Index',
                }}
                name="Index"
                tick={{ fontSize: 12 }}
                type="number"
              />
              <YAxis
                dataKey="y"
                label={{
                  angle: -90,
                  position: 'insideLeft',
                  value: 'Metric Value',
                }}
                name="Metric Value"
                tick={{ fontSize: 12 }}
                type="number"
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(_, __, props) => {
                  const p = props as {
                    payload: { metric: string; x: number; y: number };
                  };
                  return `${p.payload.metric}: ${p.payload.y}`;
                }}
              />
              <Scatter
                data={data}
                fill="#2563eb"
                name="Evaluation Metrics"
                shape="circle"
              />
            </ScatterChart>
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
