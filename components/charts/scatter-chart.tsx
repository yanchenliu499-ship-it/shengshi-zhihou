"use client";

import * as echarts from "echarts";
import { useEffect, useMemo, useState } from "react";
import { EChart } from "@/components/chart";
import { PoemModal } from "@/components/poem-modal";
import { fetchJson, PERIOD_COLORS, type PoemPoint } from "@/lib/data";

export function ScatterChart() {
  const [poems, setPoems] = useState<PoemPoint[] | null>(null);
  const [selected, setSelected] = useState<PoemPoint | null>(null);

  useEffect(() => {
    fetchJson<PoemPoint[]>("/data/poem_map.json").then(setPoems).catch(console.error);
  }, []);

  const option = useMemo<echarts.EChartsOption>(() => {
    const periods = ["肃宗—代宗", "德宗—宪宗", "穆宗—文宗", "武宗—哀帝"];
    const series = periods.map((pd, pi) => ({
      name: pd,
      type: "scatter" as const,
      data: (poems ?? [])
        .filter((p) => p.period === pd)
        .map((p) => ({
          value: [pi + (Math.random() - 0.5) * 0.4, p.sentiment],
          poem: p,
          symbolSize: 6 + Math.abs(p.sentiment) * 4,
        })),
      symbolSize: 8,
      itemStyle: { color: PERIOD_COLORS[pi], opacity: 0.65 },
      emphasis: {
        itemStyle: { opacity: 1, borderColor: "#35475F", borderWidth: 1.5 },
        scale: 1.4,
      },
    }));

    return {
      animationDuration: 600,
      tooltip: {
        trigger: "item",
        formatter: (params: unknown) => {
          const data = (params as { data?: { poem?: PoemPoint } }).data;
          const p = data?.poem;
          if (!p) return "";
          return `<b>${p.author}</b> · ${p.title}<br/>情感: ${p.sentiment.toFixed(2)} | 正/${p.positive_words} 负/${p.negative_words}<br/><i style="color:#AA967E;">点击查看详情</i>`;
        },
      },
      grid: { top: 30, right: 30, bottom: 45, left: 60 },
      xAxis: {
        type: "value",
        min: -0.5,
        max: 3.5,
        axisLabel: {
          formatter: (v: number) => periods[Math.round(v)] || "",
          color: "#5F2C21",
          fontSize: 11,
        },
        axisLine: { lineStyle: { color: "rgba(170,150,126,0.35)" } },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        min: -1.2,
        max: 1.2,
        name: "情感分值",
        nameTextStyle: { color: "#AA967E", fontSize: 11 },
        axisLabel: { color: "#AA967E" },
        splitLine: { lineStyle: { color: "#E7E2D8" } },
      },
      series,
      legend: {
        data: periods,
        bottom: 0,
        textStyle: { color: "#5F2C21", fontSize: 11 },
      },
    };
  }, [poems]);

  return (
    <>
      <EChart
        option={option}
        className="h-[380px] w-full md:h-[440px]"
        onReady={(chart) => {
          chart.on("click", (params: unknown) => {
            const poem = (params as { data?: { poem?: PoemPoint } }).data?.poem;
            if (poem) setSelected(poem);
          });
        }}
      />
      {selected && <PoemModal poem={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
