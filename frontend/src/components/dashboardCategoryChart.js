"use client";

import { PieChart, Pie, ResponsiveContainer, Tooltip, Sector } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CATEGORY_COLORS = {
  Personal: "#8B5CF6",
  Work: "#3B82F6",
  Ideas: "#06B6D4",
  Learning: "#10B981",
  Journal: "#F59E0B",
};

const DEFAULT_CATEGORIES = ["Personal", "Work", "Ideas", "Learning", "Journal"];

const FALLBACK_COLOR = "#6B7280";

function CustomPieShape({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  payload,
}) {
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={payload?.color ?? FALLBACK_COLOR}
      stroke="white"
      strokeWidth={5}
    />
  );
}

export default function CategoriesCard({ data = [] }) {
  const counts = new Map();

  for (const item of data) {
    const key = (item?.category ?? "Other").toLowerCase();
    const count = Number(item?.count) || 0;

    counts.set(key, (counts.get(key) ?? 0) + count);
  }

  const extras = [...counts.keys()].filter(
    (key) =>
      !DEFAULT_CATEGORIES.some((category) => category.toLowerCase() === key),
  );

  const chartData = [...DEFAULT_CATEGORIES, ...extras].map((category) => ({
    name: category,
    value: counts.get(category.toLowerCase()) ?? 0,
    color: CATEGORY_COLORS[category] ?? FALLBACK_COLOR,
  }));

  return (
    <Card className="rounded-3xl bg-[#FCFDFF] shadow dark:bg-[#0D0F1D]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Categories</CardTitle>

        <CardDescription>Distribution of your notes</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-6">
          <div className="mt-16 h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#fff",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  cursor={false}
                />

                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={72}
                  startAngle={180}
                  endAngle={-180}
                  paddingAngle={4}
                  shape={CustomPieShape}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-16 flex-1 space-y-3">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />

                  <span className="text-base text-gray-700 dark:text-gray-100">
                    {item.name}
                  </span>
                </div>

                <span className="text-gray-500 dark:text-gray-100">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
