"use client";

import * as echarts from "echarts";
import { useEffect, useMemo, useState } from "react";
import { EChart } from "@/components/chart";
import { fetchJson, type LdaKData } from "@/lib/data";

const PERIOD_COLORS = ["#791716", "#BF8567", "#5F2C21", "#AA967E"];

function baseGrid() {
  return { top: 30, right: 30, bottom: 40, left: 55 };
}

/** 模块 12：LDA 最佳主题数检验（困惑度 + 一致性） */
export function LdaKChart() {
  const [data, setData] = useState<LdaKData | null>(null);
  useEffect(() => {
    fetchJson<LdaKData>("/data/lda_k_curve.json").then(setData).catch(console.error);
  }, []);

  const perpOption = useMemo<echarts.EChartsOption>(() => {
    const ks = data?.k_range ?? [];
    return {
      animationDuration: 600,
      tooltip: { trigger: "axis" },
      legend: { data: data?.periods ?? [], bottom: 0, textStyle: { color: "#5F2C21", fontSize: 10 } },
      grid: { top: 25, right: 25, bottom: 45, left: 55 },
      xAxis: {
        type: "category",
        data: ks,
        name: "主题数 K",
        nameTextStyle: { color: "#AA967E", fontSize: 10 },
        axisLabel: { color: "#5F2C21", fontSize: 10 },
        axisLine: { lineStyle: { color: "rgba(170,150,126,0.35)" } },
      },
      yAxis: {
        type: "value",
        name: "困惑度 Perplexity",
        nameTextStyle: { color: "#AA967E", fontSize: 10 },
        axisLabel: { color: "#AA967E", fontSize: 10 },
        splitLine: { lineStyle: { color: "#E7E2D8" } },
      },
      series: (data?.periods ?? []).map((pd, i) => ({
        name: pd,
        type: "line" as const,
        data: data?.series[pd]?.perplexity ?? [],
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        lineStyle: { color: PERIOD_COLORS[i], width: 2 },
        itemStyle: { color: PERIOD_COLORS[i] },
        markLine: i === 0
          ? {
              silent: true,
              symbol: "none",
              label: { formatter: "K=5（现行）", color: "#35475F", fontSize: 10 },
              data: [{ xAxis: 5, lineStyle: { color: "#35475F", type: "dashed" } }],
            }
          : undefined,
      })),
    };
  }, [data]);

  const cohOption = useMemo<echarts.EChartsOption>(() => {
    const ks = data?.k_range ?? [];
    return {
      animationDuration: 600,
      tooltip: { trigger: "axis", valueFormatter: (v: unknown) => Number(v).toFixed(3) },
      legend: { data: data?.periods ?? [], bottom: 0, textStyle: { color: "#5F2C21", fontSize: 10 } },
      grid: { top: 25, right: 25, bottom: 45, left: 55 },
      xAxis: {
        type: "category",
        data: ks,
        name: "主题数 K",
        nameTextStyle: { color: "#AA967E", fontSize: 10 },
        axisLabel: { color: "#5F2C21", fontSize: 10 },
        axisLine: { lineStyle: { color: "rgba(170,150,126,0.35)" } },
      },
      yAxis: {
        type: "value",
        name: "UMass Coherence",
        nameTextStyle: { color: "#AA967E", fontSize: 10 },
        axisLabel: { color: "#AA967E", fontSize: 10 },
        splitLine: { lineStyle: { color: "#E7E2D8" } },
      },
      series: (data?.periods ?? []).map((pd, i) => ({
        name: pd,
        type: "line" as const,
        data: data?.series[pd]?.coherence ?? [],
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        lineStyle: { color: PERIOD_COLORS[i], width: 2 },
        itemStyle: { color: PERIOD_COLORS[i] },
        markLine: i === 0
          ? {
              silent: true,
              symbol: "none",
              label: { formatter: "K=5（现行）", color: "#35475F", fontSize: 10 },
              data: [{ xAxis: 5, lineStyle: { color: "#35475F", type: "dashed" } }],
            }
          : undefined,
      })),
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <EChart option={perpOption} className="h-[300px] w-full md:h-[340px]" />
      <EChart option={cohOption} className="h-[300px] w-full md:h-[340px]" />
    </div>
  );
}
