"use client";

import * as echarts from "echarts";
import { useEffect, useMemo, useState } from "react";
import { EChart } from "@/components/chart";
import { fetchJson, type SentimentData } from "@/lib/data";

/** 模块 2：态度构成演变（堆叠柱状图） */
export function AttitudeChart() {
  const [data, setData] = useState<SentimentData | null>(null);
  useEffect(() => {
    fetchJson<SentimentData>("/data/sentiment.json").then(setData).catch(console.error);
  }, []);

  const option = useMemo<echarts.EChartsOption>(() => {
    const keys = ["正向", "负向", "中性"];
    const colors = ["#b8860b", "#8b1a1a", "#9b8e7a"];
    return {
      animationDuration: 600,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: unknown) => {
          const list = params as { axisValue: string; marker: string; seriesName: string; value: number }[];
          let s = `<b>${list[0].axisValue}</b><br/>`;
          list.forEach((p) => {
            s += `${p.marker} ${p.seriesName}: ${(p.value * 100).toFixed(1)}%<br/>`;
          });
          return s;
        },
      },
      legend: { data: keys, bottom: 0, textStyle: { color: "#6b5e4a", fontSize: 11 } },
      grid: { top: 20, right: 30, bottom: 50, left: 50 },
      xAxis: {
        type: "category",
        data: data?.periods ?? [],
        axisLabel: { color: "#6b5e4a", fontSize: 11 },
        axisLine: { lineStyle: { color: "#e0d8c8" } },
      },
      yAxis: {
        type: "value",
        max: 1,
        axisLabel: { color: "#9b8e7a", formatter: (v: number) => `${v * 100}%` },
        splitLine: { lineStyle: { color: "#f0ebe0" } },
      },
      series: keys.map((key, i) => ({
        name: key,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        itemStyle: {
          color: colors[i],
          borderRadius: i === keys.length - 1 ? [4, 4, 0, 0] : 0,
        },
        data: (data?.attitudes ?? []).map((d) => d[key] ?? 0),
      })),
    };
  }, [data]);

  return <EChart option={option} className="h-[320px] w-full md:h-[380px]" />;
}

/** 模块 3：归因对象变迁（折线图） */
export function BlameChart() {
  const [data, setData] = useState<SentimentData | null>(null);
  useEffect(() => {
    fetchJson<SentimentData>("/data/sentiment.json").then(setData).catch(console.error);
  }, []);

  const option = useMemo<echarts.EChartsOption>(() => {
    const keys =
      data && data.blameAttribution.length > 0
        ? Object.keys(data.blameAttribution[0]).filter((k) => k !== "period")
        : ["安禄山", "玄宗失德", "制度缺陷", "天命", "其他"];
    const colors = ["#8b1a1a", "#c44d4d", "#b8860b", "#6b5e4a", "#9b8e7a", "#2c2416"];
    return {
      animationDuration: 600,
      tooltip: {
        trigger: "axis",
        formatter: (params: unknown) => {
          const list = params as { axisValue: string; marker: string; seriesName: string; value: number }[];
          let s = `<b>${list[0].axisValue}</b><br/>`;
          list.forEach((p) => {
            s += `${p.marker} ${p.seriesName}: ${(p.value * 100).toFixed(1)}%<br/>`;
          });
          return s;
        },
      },
      legend: {
        data: keys,
        bottom: 0,
        textStyle: { color: "#6b5e4a", fontSize: 10 },
        itemWidth: 12,
        itemHeight: 12,
      },
      grid: { top: 30, right: 30, bottom: 55, left: 50 },
      xAxis: {
        type: "category",
        data: data?.periods ?? [],
        axisLabel: { color: "#6b5e4a", fontSize: 11 },
        axisLine: { lineStyle: { color: "#e0d8c8" } },
      },
      yAxis: {
        type: "value",
        max: 0.4,
        axisLabel: { color: "#9b8e7a", formatter: (v: number) => `${(v * 100).toFixed(0)}%` },
        splitLine: { lineStyle: { color: "#f0ebe0" } },
      },
      series: keys.map((key, i) => ({
        name: key,
        type: "line",
        data: (data?.blameAttribution ?? []).map((d) => d[key] ?? 0),
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: { width: 2.5, color: colors[i] },
        itemStyle: { color: colors[i] },
        areaStyle: { opacity: 0.05 },
      })),
    };
  }, [data]);

  return <EChart option={option} className="h-[320px] w-full md:h-[380px]" />;
}

/** 模块 5：情感趋势（Senta 模型 vs 人工词典 双方法对照） */
export function KeywordTrendChart() {
  const [data, setData] = useState<SentimentData | null>(null);
  useEffect(() => {
    fetchJson<SentimentData>("/data/sentiment.json").then(setData).catch(console.error);
  }, []);

  const option = useMemo<echarts.EChartsOption>(() => {
    const trend = data?.sentiment_trend ?? [];
    const lexicon = data?.lexicon_trend ?? [];
    return {
      animationDuration: 600,
      tooltip: {
        trigger: "axis",
        formatter: (params: unknown) => {
          const list = params as { axisValue: string; marker: string; seriesName: string; value: number }[];
          if (!list.length) return "";
          let s = `<b>${list[0].axisValue}</b><br/>`;
          list.forEach((p) => {
            s += `${p.marker} ${p.seriesName}: <b>${Number(p.value).toFixed(2)}</b><br/>`;
          });
          return s;
        },
      },
      legend: {
        data: ["Senta 模型", "人工词典"],
        bottom: 0,
        textStyle: { color: "#6b5e4a", fontSize: 11 },
      },
      grid: { top: 30, right: 30, bottom: 50, left: 50 },
      xAxis: {
        type: "category",
        data: trend.map((d) => d.period),
        axisLabel: { color: "#6b5e4a", fontSize: 11 },
        axisLine: { lineStyle: { color: "#e0d8c8" } },
      },
      yAxis: {
        type: "value",
        min: -0.6,
        max: 0.6,
        axisLabel: { color: "#9b8e7a" },
        splitLine: { lineStyle: { color: "#f0ebe0" } },
        name: "情感均值 (-1→+1)",
        nameTextStyle: { color: "#9b8e7a", fontSize: 10 },
      },
      series: [
        {
          name: "Senta 模型",
          type: "line",
          data: trend.map((d) => d.avg),
          smooth: true,
          lineStyle: { color: "#8b1a1a", width: 3 },
          itemStyle: { color: "#8b1a1a" },
          symbol: "circle",
          symbolSize: 12,
          label: {
            show: true,
            formatter: (p: { value?: unknown }) => Number(p.value ?? 0).toFixed(2),
            color: "#8b1a1a",
            fontSize: 12,
            fontWeight: "bold",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(139,26,26,0.18)" },
              { offset: 1, color: "rgba(139,26,26,0.02)" },
            ]),
          },
          markLine: {
            silent: true,
            symbol: "none",
            data: [{ yAxis: 0, lineStyle: { color: "#e0d8c8", type: "dashed" } }],
          },
        },
        {
          name: "人工词典",
          type: "line",
          data: lexicon.map((d) => d.avg),
          smooth: true,
          lineStyle: { color: "#b8860b", width: 2.5, type: "dashed" },
          itemStyle: { color: "#b8860b" },
          symbol: "diamond",
          symbolSize: 11,
        },
      ],
    };
  }, [data]);

  return <EChart option={option} className="h-[300px] w-full md:h-[360px]" />;
}
