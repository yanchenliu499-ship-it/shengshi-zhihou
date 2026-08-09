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
    const colors = ["#BF8567", "#791716", "#AA967E"];
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
      legend: { data: keys, bottom: 0, textStyle: { color: "#5F2C21", fontSize: 11 } },
      grid: { top: 20, right: 30, bottom: 50, left: 50 },
      xAxis: {
        type: "category",
        data: data?.periods ?? [],
        axisLabel: { color: "#5F2C21", fontSize: 11 },
        axisLine: { lineStyle: { color: "rgba(170,150,126,0.35)" } },
      },
      yAxis: {
        type: "value",
        max: 1,
        axisLabel: { color: "#AA967E", formatter: (v: number) => `${v * 100}%` },
        splitLine: { lineStyle: { color: "#E7E2D8" } },
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
    const colors = ["#791716", "#BF8567", "#BF8567", "#5F2C21", "#AA967E", "#35475F"];
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
        textStyle: { color: "#5F2C21", fontSize: 10 },
        itemWidth: 12,
        itemHeight: 12,
      },
      grid: { top: 30, right: 30, bottom: 55, left: 50 },
      xAxis: {
        type: "category",
        data: data?.periods ?? [],
        axisLabel: { color: "#5F2C21", fontSize: 11 },
        axisLine: { lineStyle: { color: "rgba(170,150,126,0.35)" } },
      },
      yAxis: {
        type: "value",
        max: 0.4,
        axisLabel: { color: "#AA967E", formatter: (v: number) => `${(v * 100).toFixed(0)}%` },
        splitLine: { lineStyle: { color: "#E7E2D8" } },
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
        textStyle: { color: "#5F2C21", fontSize: 11 },
      },
      grid: { top: 30, right: 30, bottom: 50, left: 50 },
      xAxis: {
        type: "category",
        data: trend.map((d) => d.period),
        axisLabel: { color: "#5F2C21", fontSize: 11 },
        axisLine: { lineStyle: { color: "rgba(170,150,126,0.35)" } },
      },
      yAxis: {
        type: "value",
        min: -0.6,
        max: 0.6,
        axisLabel: { color: "#AA967E" },
        splitLine: { lineStyle: { color: "#E7E2D8" } },
        name: "情感均值 (-1→+1)",
        nameTextStyle: { color: "#AA967E", fontSize: 10 },
      },
      series: [
        {
          name: "Senta 模型",
          type: "line",
          data: trend.map((d) => d.avg),
          smooth: true,
          lineStyle: { color: "#791716", width: 3 },
          itemStyle: { color: "#791716" },
          symbol: "circle",
          symbolSize: 12,
          label: {
            show: true,
            formatter: (p: { value?: unknown }) => Number(p.value ?? 0).toFixed(2),
            color: "#791716",
            fontSize: 12,
            fontWeight: "bold",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(121,23,22,0.18)" },
              { offset: 1, color: "rgba(121,23,22,0.02)" },
            ]),
          },
          markLine: {
            silent: true,
            symbol: "none",
            data: [{ yAxis: 0, lineStyle: { color: "rgba(170,150,126,0.35)", type: "dashed" } }],
          },
        },
        {
          name: "人工词典",
          type: "line",
          data: lexicon.map((d) => d.avg),
          smooth: true,
          lineStyle: { color: "#BF8567", width: 2.5, type: "dashed" },
          itemStyle: { color: "#BF8567" },
          symbol: "diamond",
          symbolSize: 11,
        },
      ],
    };
  }, [data]);

  return <EChart option={option} className="h-[300px] w-full md:h-[360px]" />;
}
