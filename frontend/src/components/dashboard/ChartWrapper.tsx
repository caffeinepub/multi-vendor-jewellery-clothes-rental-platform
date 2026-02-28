import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartWrapperProps {
  type: 'line' | 'bar' | 'pie';
  data: Record<string, unknown>[];
  dataKeys: { key: string; color: string; name?: string }[];
  xKey?: string;
  height?: number;
  title?: string;
}

const COLORS = [
  'oklch(0.32 0.09 165)',
  'oklch(0.72 0.12 75)',
  'oklch(0.55 0.1 70)',
  'oklch(0.45 0.1 165)',
  'oklch(0.65 0.15 30)',
];

export default function ChartWrapper({
  type,
  data,
  dataKeys,
  xKey = 'name',
  height = 250,
  title,
}: ChartWrapperProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      {title && (
        <h3 className="font-display font-semibold text-foreground mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.015 80)" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {dataKeys.map((dk) => (
              <Line
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                stroke={dk.color}
                name={dk.name ?? dk.key}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        ) : type === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.015 80)" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {dataKeys.map((dk) => (
              <Bar key={dk.key} dataKey={dk.key} fill={dk.color} name={dk.name ?? dk.key} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey={dataKeys[0]?.key ?? 'value'}
              nameKey={xKey}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
