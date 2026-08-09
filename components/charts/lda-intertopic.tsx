"use client";

import * as echarts from "echarts";
import { useEffect, useMemo, useState } from "react";
import { EChart } from "@/components/chart";
import { fetchJson, type LdaIntertopicData } from "@/lib/data";

const PERIOD_COLORS = ["#791716", "#BF8567", "#5F2C21", "#AA967E"];

/** 模块 13：LDA 主题聚类图（MDS 投影，交互） */
export function LdaIntertopicChart() {
  const [data, setData] = useState<LdaIntertopicData | null>(null);
  useEffect(() => {
    fetchJson<LdaIntertopicData>("/data/lda_intertopic.json").then(setData).catch(console.error);
  }, []);

  const option = useMemo<echarts.EChartsOption>(() => {
    const periods = data?.periods ?? [];
    return {
      animationDuration: 600,
      tooltip: {
        trigger: "item",
        formatter: (params: unknown) => {
          const d = (params as { data?: { period?: string; topic_id?: number; prevalence?: number; top_words?: string; top5?: string[] } }).data;
          if (!d) return "";
          return `<b>${d.period} · 主题 ${d.topic_id}</b><br/>` +
            `主题占比: ${((d.prevalence ?? 0) * 100).toFixed(1)}%<br/>` +
            `<span style="color:#5F2C21">${(d.top5 ?? []).join("、")}</span>`;
        },
      },
      legend: { data: periods, bottom: 0, textStyle: { color: "#5F2C21", fontSize: 11 } },
      grid: { top: 20, right: 30, bottom: 40, left: 40 },
      xAxis: {
        type: "value",
        name: "MDS 维度 1",
        nameTextStyle: { color: "#AA967E", fontSize: 10 },
        axisLabel: { color: "#AA967E", fontSize: 9 },
        splitLine: { lineStyle: { color: "#E7E2D8" } },
      },
      yAxis: {
        type: "value",
        name: "MDS 维度 2",
        nameTextStyle: { color: "#AA967E", fontSize: 10 },
        axisLabel: { color: "#AA967E", fontSize: 9 },
        splitLine: { lineStyle: { color: "#E7E2D8" } },
      },
      series: periods.map((pd, pi) => ({
        name: pd,
        type: "scatter" as const,
        data: (data?.topics ?? [])
          .filter((t) => t.period === pd)
          .map((t) => ({
            value: [t.x, t.y],
            period: t.period,
            topic_id: t.topic_id,
            prevalence: t.prevalence,
            top_words: t.top_words,
            top5: t.top5,
          })),
        symbolSize: (val: unknown) => {
          const v = val as { prevalence?: number };
          return 18 + (v.prevalence ?? 0) * 90;
        },
        itemStyle: { color: PERIOD_COLORS[pi], opacity: 0.82, borderColor: "#35475F", borderWidth: 0.6 },
        label: {
          show: true,
          formatter: (p: unknown) => {
            const d = (p as { data?: { top_words?: string } }).data;
            return d?.top_words ?? "";
          },
          color: "#35475F",
          fontSize: 10,
          position: "bottom",
        },
        emphasis: { itemStyle: { opacity: 1, borderWidth: 1.5 }, scale: 1.3 },
      })),
    };
  }, [data]);

  return <EChart option={option} className="h-[420px] w-full md:h-[480px]" />;
}
