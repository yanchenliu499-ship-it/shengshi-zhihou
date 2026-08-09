"use client";

import * as echarts from "echarts";
import { useEffect, useMemo, useState } from "react";
import { EChart } from "@/components/chart";
import { fetchJson, type LdaKData } from "@/lib/data";

const PERIOD_COLORS = ["#8b1a1a", "#b8860b", "#6b5e4a", "#9b8e7a"];

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
      legend: { data: data?.periods ?? [], bottom: 0, textStyle: { color: "#6b5e4a", fontSize: 10 } },
      grid: { top: 25, right: 25, bottom: 45, left: 55 },
      xAxis: {
        type: "category",
        data: ks,
        name: "主题数 K",
        nameTextStyle: { color: "#9b8e7a", fontSize: 10 },
        axisLabel: { color: "#6b5e4a", fontSize: 10 },
        axisLine: { lineStyle: { color: "#e0d8c8" } },
      },
      yAxis: {
        type: "value",
        name: "困惑度 Perplexity",
        nameTextStyle: { color: "#9b8e7a", fontSize: 10 },
        axisLabel: { color: "#9b8e7a", fontSize: 10 },
        splitLine: { lineStyle: { color: "#f0ebe0" } },
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
              label: { formatter: "K=5（现行）", color: "#2c2416", fontSize: 10 },
              data: [{ xAxis: 5, lineStyle: { color: "#2c2416", type: "dashed" } }],
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
      legend: { data: data?.periods ?? [], bottom: 0, textStyle: { color: "#6b5e4a", fontSize: 10 } },
      grid: { top: 25, right: 25, bottom: 45, left: 55 },
      xAxis: {
        type: "category",
        data: ks,
        name: "主题数 K",
        nameTextStyle: { color: "#9b8e7a", fontSize: 10 },
        axisLabel: { color: "#6b5e4a", fontSize: 10 },
        axisLine: { lineStyle: { color: "#e0d8c8" } },
      },
      yAxis: {
        type: "value",
        name: "UMass Coherence",
        nameTextStyle: { color: "#9b8e7a", fontSize: 10 },
        axisLabel: { color: "#9b8e7a", fontSize: 10 },
        splitLine: { lineStyle: { color: "#f0ebe0" } },
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
              label: { formatter: "K=5（现行）", color: "#2c2416", fontSize: 10 },
              data: [{ xAxis: 5, lineStyle: { color: "#2c2416", type: "dashed" } }],
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
