import * as React from "react";
import {
  Line,
  LineChart as RechartsLineChart,
  Bar,
  BarChart as RechartsBarChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const Chart = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div className={cn("relative w-full", className)} ref={ref} {...props} />
  );
});
Chart.displayName = "Chart";

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { config?: Record<string, any> }
>(({ className, config, ...props }, ref) => {
  // Create CSS variables for chart colors
  const style = config
    ? Object.entries(config).reduce(
        (acc, [key, value]) => {
          if (value && typeof value === "object" && value.color) {
            acc[`--color-${key}`] = value.color;
          }
          return acc;
        },
        {} as Record<string, string>,
      )
    : {};

  return (
    <div
      className={cn("h-full w-full", className)}
      style={style}
      ref={ref}
      {...props}
    />
  );
});
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("bg-popover rounded-md border p-2 shadow-md", className)}
      ref={ref}
      {...props}
    />
  );
});
ChartTooltip.displayName = "ChartTooltip";

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div className={cn("text-sm", className)} ref={ref} {...props} />;
});
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div className={cn("flex items-center", className)} ref={ref} {...props} />
  );
});
ChartLegend.displayName = "ChartLegend";

const ChartLegendItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("flex items-center gap-2 text-sm", className)}
      ref={ref}
      {...props}
    />
  );
});
ChartLegendItem.displayName = "ChartLegendItem";

// Line Chart Component
interface LineChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["blue", "green", "red", "yellow", "purple"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey={index} />
        <YAxis tickFormatter={valueFormatter} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border rounded-md shadow-md p-2">
                  <p className="font-medium">{label}</p>
                  {payload.map((entry, index) => (
                    <p key={`item-${index}`} style={{ color: entry.color }}>
                      {entry.name}: {valueFormatter(entry.value as number)}
                    </p>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={`hsl(var(--${colors[index % colors.length]}))`}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

// Bar Chart Component
interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["blue", "green", "red", "yellow", "purple"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey={index} />
        <YAxis tickFormatter={valueFormatter} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border rounded-md shadow-md p-2">
                  <p className="font-medium">{label}</p>
                  {payload.map((entry, index) => (
                    <p key={`item-${index}`} style={{ color: entry.color }}>
                      {entry.name}: {valueFormatter(entry.value as number)}
                    </p>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            fill={`hsl(var(--${colors[index % colors.length]}))`}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// Pie Chart Component
interface PieChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function PieChart({
  data,
  index,
  categories,
  colors = ["blue", "green", "red", "yellow", "purple"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsPieChart>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border rounded-md shadow-md p-2">
                  <p className="font-medium">{payload[0].name}</p>
                  <p style={{ color: payload[0].color }}>
                    {valueFormatter(payload[0].value as number)}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={categories[0]}
          nameKey={index}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`hsl(var(--${colors[index % colors.length]}))`}
            />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
};
