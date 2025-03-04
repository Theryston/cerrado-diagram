"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AssetClass } from "@/lib/types";

type CharClassProps = {
  assetClasses: AssetClass[];
  totalPercentage: number;
};

export function CharClass({
  assetClasses,
  totalPercentage = 0,
}: CharClassProps) {
  const chartData = assetClasses.map((assetClass) => ({
    ...assetClass,
    fill: assetClass.color,
  }));

  const chartConfig = {} satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-fit">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="percentage"
          nameKey="name"
          innerRadius={
            typeof window !== "undefined" && window.innerWidth < 768 ? 45 : 60
          }
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="font-bold text-sm"
                    >
                      {totalPercentage}%
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
