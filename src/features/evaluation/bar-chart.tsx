'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
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
  // Detect current colour-scheme (light / dark / system → resolved to actual theme)
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // ──────────────────────────────────────────────────────────────────────────────
  // Theme-dependent tokens
  // ──────────────────────────────────────────────────────────────────────────────
  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: isDark ? '#1f2937' /* slate-800 */ : '#ffffff',
      border: `1px solid ${isDark ? '#4b5563' /* slate-600 */ : '#d1d5db' /* gray-300 */}`,
      borderRadius: '8px',
      color: isDark ? '#f3f4f6' /* gray-100 */ : '#111827' /* gray-900 */,
    }),
    [isDark],
  );

  const cursorFill = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const gridStroke = isDark
    ? '#374151' /* slate-700 */
    : '#e5e7eb'; /* gray-200 */

  // ──────────────────────────────────────────────────────────────────────────────
  // Helper renderer keeps logic DRY
  // ──────────────────────────────────────────────────────────────────────────────
  const renderChart = (
    data: Record<string, number | string>[],
    bars: { color: string; key: string; name: string }[],
    title: string,
    metricsLabel: string,
  ) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={320} width="100%">
          <BarChart
            data={data}
            margin={{ bottom: 0, left: 0, right: 24, top: 16 }}
          >
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
            <XAxis
              dataKey="metric"
              tick={{ fontSize: 12 }}
              tickFormatter={(value: string) =>
                value.length > 20 ? `${value.slice(0, 20)}...` : value
              }
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: cursorFill }}
            />
            {bars.map(({ color, key, name }) => (
              <Bar dataKey={key} fill={color} key={key} name={name} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <div className="text-muted-foreground mt-2 text-xs">
          <b>Metrics:</b> {metricsLabel}
        </div>
      </CardContent>
    </Card>
  );

  // ──────────────────────────────────────────────────────────────────────────────
  // 1. No metrics at all ➜ early exit
  // ──────────────────────────────────────────────────────────────────────────────
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

  // ──────────────────────────────────────────────────────────────────────────────
  // 2. Both baseline **and** evaluation metrics present (comparison view)
  // ──────────────────────────────────────────────────────────────────────────────
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

    return renderChart(
      chartData,
      [
        { color: '#3b82f6', key: 'baseline', name: 'Baseline' },
        { color: '#10b981', key: 'evaluation', name: 'Evaluation' },
      ],
      'Metrics Comparison: Baseline vs. Evaluation',
      keys.join(', '),
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // 3. Evaluation-only chart
  // ──────────────────────────────────────────────────────────────────────────────
  if (evaluationMetrics) {
    const keys = Object.keys(evaluationMetrics).filter(
      (k) => k !== 'num_samples' && typeof evaluationMetrics[k] === 'number',
    );

    const chartData = keys.map((k) => ({
      evaluation: evaluationMetrics[k],
      metric: k,
    }));

    return renderChart(
      chartData,
      [{ color: '#10b981', key: 'evaluation', name: 'Evaluation' }],
      'Evaluation Metrics',
      keys.join(', '),
    );
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // 4. Baseline-only chart
  // ──────────────────────────────────────────────────────────────────────────────
  if (baselineMetrics) {
    const keys = Object.keys(baselineMetrics).filter(
      (k) => k !== 'num_samples' && typeof baselineMetrics[k] === 'number',
    );

    const chartData = keys.map((k) => ({
      baseline: baselineMetrics[k],
      metric: k,
    }));

    return renderChart(
      chartData,
      [{ color: '#3b82f6', key: 'baseline', name: 'Baseline' }],
      'Baseline Metrics',
      keys.join(', '),
    );
  }
};

export default EvaluationScatterChart;
