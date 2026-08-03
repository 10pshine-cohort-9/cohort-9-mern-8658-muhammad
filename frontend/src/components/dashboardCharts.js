"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const chartData = [
  { day: "Sun", desktop: 214 },
  { day: "Mon", desktop: 186 },
  { day: "Tue", desktop: 305 },
  { day: "Wed", desktop: 237 },
  { day: "Thu", desktop: 73 },
  { day: "Fri", desktop: 209 },
  { day: "Sat", desktop: 214 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">{label}</p>

      <p className="mt-1 text-sm font-medium text-violet-600">
        {payload[0].value} Notes
      </p>
    </div>
  );
}

export function ChartAreaLinear() {
  return (
    <Card className="font-sans shadow bg-[#FCFDFF] dark:bg-[#0D0F1D]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              Activity this week
            </CardTitle>

            <CardDescription>Notes updated per day</CardDescription>
          </div>

          <CardAction>
            <div className="rounded-full bg-violet-50 dark:bg-indigo-950/60 px-3 py-1.5 text-xs font-semibold text-violet-600">
              Last 7 Days
            </div>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.45} />

                <stop offset="100%" stopColor="#faf5ff" stopOpacity={0.08} />
              </linearGradient>
            </defs>

           

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 13 }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#8b5cf6",
                strokeDasharray: "5 5",
                strokeWidth: 1,
              }}
            />

                       

            <Area
              type="linear"
              dataKey="desktop"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#purpleGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#8b5cf6",
                stroke: "#fff",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter className={"bg-transparent border-0"}></CardFooter>
    </Card>
  );  
}



