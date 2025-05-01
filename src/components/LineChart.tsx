"use client";

import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

interface LineChartProps {
  data: Record<string, any>[];
  index: string;
  categories: string[];
  className?: string;
  valueFormatter?: (value: number) => string;
  onValueChange?: (v: any) => void;
  xAxisLabel?: string;
  yAxisLabel?: string;
  colors?: string[];
  connectNulls?: boolean;
}

const defaultColors = {
  indigo: "#6366f1",
  slate: "#64748b",
  amber: "#f59e0b",
  violet: "#8b5cf6",
  emerald: "#10b981",
  rose: "#e11d48",
  blue: "#3b82f6",
};

export const LineChart = ({
  data,
  index,
  categories,
  className,
  valueFormatter = (value: number) => `$${value.toLocaleString()}`,
  onValueChange,
  xAxisLabel,
  yAxisLabel,
  colors: customColors,
  connectNulls = false,
}: LineChartProps) => {
  const [hiddenSeries, setHiddenSeries] = React.useState<Set<string>>(
    new Set()
  );

  const getColorForCategory = (category: string, index: number): string => {
    if (customColors && customColors.length > 0) {
      if (category === "Portfolio") return getColorByName(customColors[0]);
      const colorIndex = categories.indexOf(category);
      if (colorIndex >= 0 && colorIndex < customColors.length) {
        return getColorByName(customColors[colorIndex]);
      }
    }

    if (category === "Portfolio") return defaultColors.indigo;
    const colorKeys = Object.keys(
      defaultColors
    ) as (keyof typeof defaultColors)[];
    return defaultColors[colorKeys[(index - 1) % colorKeys.length]];
  };

  const getColorByName = (colorName: string): string => {
    if (colorName in defaultColors) {
      return defaultColors[colorName as keyof typeof defaultColors];
    }
    return colorName;
  };

  const handleLegendClick = (e: any) => {
    const series = e.dataKey;
    if (series === "Portfolio") return;
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(series)) {
        next.delete(series);
      } else {
        next.add(series);
      }
      return next;
    });
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    const comparisons = payload.filter(
      (entry: any) => entry.value !== "Portfolio"
    );

    return (
      <div className="flex flex-wrap gap-2 justify-end">
        {comparisons.map((entry: any, index: number) => (
          <button
            key={`item-${index}`}
            onClick={() => handleLegendClick(entry)}
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition-all
              ${
                !hiddenSeries.has(entry.dataKey)
                  ? "text-gray-900 bg-gray-50"
                  : "text-gray-400 hover:text-gray-500"
              }
              hover:bg-gray-100`}
          >
            <span
              className="h-1 w-3 rounded-full transition-opacity"
              style={{
                backgroundColor: entry.color,
                opacity: !hiddenSeries.has(entry.dataKey) ? 1 : 0.4,
              }}
            />
            {entry.value}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={className}>
      <ResponsiveContainer>
        <RechartsLineChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey={index}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickFormatter={valueFormatter}
            width={80}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <div className="mb-2 text-sm font-medium">{label}</div>
                    <div className="space-y-1">
                      {payload
                        .filter((entry) => {
                          const dataKey = entry.dataKey as string;
                          return (
                            dataKey === "Portfolio" ||
                            !hiddenSeries.has(dataKey)
                          );
                        })
                        .map((entry: any, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm text-gray-600">
                              {entry.name}:
                            </span>
                            <span className="text-sm font-medium">
                              {valueFormatter(entry.value)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            height={36}
            content={renderLegend}
          />
          <Line
            key="Portfolio"
            type="monotone"
            dataKey="Portfolio"
            stroke={getColorForCategory("Portfolio", 0)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
            connectNulls={connectNulls}
          />
          {categories
            .filter((category) => category !== "Portfolio")
            .map((category, index) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={getColorForCategory(category, index + 1)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
                hide={hiddenSeries.has(category)}
                connectNulls={connectNulls}
              />
            ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
