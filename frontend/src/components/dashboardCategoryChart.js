"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const chartData = [
  { name: "Personal", value: 1, color: "#8B5CF6" },
  { name: "Work", value: 0, color: "#3B82F6" },
  { name: "Ideas", value: 0, color: "#06B6D4" },
  { name: "Learning", value: 1, color: "#10B981" },
  { name: "Journal", value: 0, color: "#F59E0B" },
];

export default function CategoriesCard() {
  return (
    <Card className="rounded-3xl shadow bg-[#FCFDFF] dark:bg-[#0D0F1D] ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Categories</CardTitle>

        <CardDescription>Distribution of your notes</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-6">
          <div className="h-44 w-44 mt-16">
            <ResponsiveContainer width="100%" height="100%" >
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={72}
                  startAngle={180}
                  endAngle={-180}
                  paddingAngle={4}
                  stroke="white"
                  strokeWidth={5}
                >
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#fff",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    cursor={false}
                  >
                    {" "}
                  </Tooltip>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-3 mt-16">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between "
              >
                <div className="flex items-center gap-3">
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
