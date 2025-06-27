'use client';

import {
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface AreaChartProps {
  data: { date: string; value: number }[];
  height?: number;
}

export const AreaChart = ({ data, height = 240 }: AreaChartProps) => (
  <ResponsiveContainer height={height} width="100%">
    <RechartsAreaChart
      data={data}
      margin={{ bottom: 0, left: 0, right: 24, top: 16 }}
    >
      <XAxis axisLine={false} dataKey="date" fontSize={12} tickLine={false} />
      <YAxis axisLine={false} fontSize={12} tickLine={false} />
      <Tooltip
        contentStyle={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
        }}
        labelStyle={{ color: '#6b7280' }}
      />
      <Area
        dataKey="value"
        fill="#60a5fa"
        stroke="#2563eb"
        strokeWidth={2}
        type="monotone"
      />
    </RechartsAreaChart>
  </ResponsiveContainer>
);
