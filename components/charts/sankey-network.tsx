"use client";

import * as echarts from "echarts";
import { useEffect, useMemo, useState } from "react";
import { EChart } from "@/components/chart";
import { fetchJson, type NetworkData, type TopicsData } from "@/lib/data";

const CAT_COLORS: Record<string, string> = {
  诗人: "#8b1a1a",
  忠臣: "#b8860b",
  文士: "#c44d4d",
  文宗: "#a83232",
  宰相: "#6b5e4a",
  史家: "#2c2416",
  隐士: "#9b8e7a",
  叛臣: "#444",
  权臣: "#555",
  君主: "#b8860b",
  事件: "#d4a843",
};

/** 模块 4：主题流变 · 桑基图 */
export function SankeyChart() {
  const [data, setData] = useState<TopicsData | null>(null);
  useEffect(() => {
    fetchJson<TopicsData>("/data/topics.json").then(setData).catch(console.error);
  }, []);

  const option = useMemo<echarts.EChartsOption>(() => {
    const flows = data?.flows ?? [];
    const names = new Set<string>();
    flows.forEach((f) => {
      names.add(f.source);
      names.add(f.target);
    });
    return {
      animationDuration: 700,
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove",
        formatter: (p: unknown) => {
          const d = p as { dataType?: string; data?: { source?: string; target?: string; value?: number; name?: string } };
          return d.dataType === "edge"
            ? `${d.data?.source} → ${d.data?.target}<br/>关联强度: ${d.data?.value}`
            : `${d.data?.name ?? ""}`;
        },
      },
      series: [
        {
          type: "sankey",
          layout: "none",
          emphasis: { focus: "adjacency" },
          nodeAlign: "left",
          layoutIterations: 0,
          data: Array.from(names).map((name) => ({ name })),
          links: flows.map((f) => ({ source: f.source, target: f.target, value: f.value })),
          label: {
            fontSize: 11,
            fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif',
            color: "#2c2416",
          },
          lineStyle: { color: "source", curveness: 0.5, opacity: 0.25 },
          itemStyle: { color: "#8b1a1a", borderWidth: 0 },
        },
      ],
    };
  }, [data]);

  return <EChart option={option} className="h-[420px] w-full md:h-[520px]" />;
}

/** 模块 6：人物—事件话语网络 */
export function NetworkChart() {
  const [data, setData] = useState<NetworkData | null>(null);
  useEffect(() => {
    fetchJson<NetworkData>("/data/network.json").then(setData).catch(console.error);
  }, []);

  const categories = [
    "诗人",
    "忠臣",
    "文士",
    "文宗",
    "宰相",
    "史家",
    "隐士",
    "叛臣",
    "权臣",
    "君主",
    "事件",
  ].map((name) => ({ name }));

  const option = useMemo<echarts.EChartsOption>(() => {
    return {
      animationDuration: 700,
      tooltip: {
        formatter: (p: unknown) => {
          const d = p as { dataType?: string; name?: string; data?: { category?: string; period?: string; source?: string; target?: string } };
          return d.dataType === "node"
            ? `<b>${d.name}</b><br/>类型: ${d.data?.category}<br/>时期: ${d.data?.period}`
            : `${d.data?.source} → ${d.data?.target}`;
        },
      },
      legend: {
        data: categories.map((c) => c.name),
        bottom: 0,
        textStyle: { color: "#6b5e4a", fontSize: 10 },
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          type: "graph",
          layout: "force",
          roam: true,
          draggable: true,
          force: { repulsion: 200, edgeLength: [80, 200], gravity: 0.1 },
          categories,
          data: (data?.nodes ?? []).map((n) => ({
            ...n,
            symbolSize: Math.max(8, n.value * 1.5),
            itemStyle: { color: CAT_COLORS[n.category] || "#8b1a1a" },
            category: n.category,
          })),
          links: (data?.links ?? []).map((l) => ({
            ...l,
            lineStyle: { color: "#e0d8c8", opacity: 0.5, width: Math.max(0.5, l.value / 5) },
          })),
          label: {
            show: true,
            position: "right",
            fontSize: 11,
            color: "#2c2416",
            fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif',
          },
          lineStyle: { curveness: 0.2, opacity: 0.5 },
          emphasis: {
            focus: "adjacency",
            label: { fontSize: 14, fontWeight: "bold" },
            itemStyle: { borderWidth: 2, borderColor: "#2c2416" },
          },
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return <EChart option={option} className="h-[420px] w-full md:h-[520px]" />;
}
