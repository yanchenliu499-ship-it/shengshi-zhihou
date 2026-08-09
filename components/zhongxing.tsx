"use client";

import * as echarts from "echarts";
import { useEffect, useMemo, useState } from "react";
import { EChart } from "@/components/chart";
import { fetchJson, PERIOD_COLORS } from "@/lib/data";

type ZhongxingPoem = {
  id: string;
  author: string;
  period: string;
  title: string;
  line: string;
  senta: number | null;
  senta_label: string;
};

type ZhongxingData = {
  total: number;
  periods: string[];
  by_period: Record<string, number>;
  poems: ZhongxingPoem[];
};

const PERIODS = ["肃宗—代宗", "德宗—宪宗", "穆宗—文宗", "武宗—哀帝"];

function sentimentEmoji(s: number | null) {
  if (s == null) return "";
  return s > 0.05 ? "🟢" : s < -0.05 ? "🔴" : "⚪";
}

/** 04 未完成的中兴 */
export function ZhongxingSection() {
  const [data, setData] = useState<ZhongxingData | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchJson<ZhongxingData>("/data/zhongxing.json").then(setData).catch(console.error);
  }, []);

  const option = useMemo<echarts.EChartsOption>(() => {
    const periods = data?.periods ?? [];
    return {
      animationDuration: 600,
      tooltip: { trigger: "axis" },
      grid: { top: 25, right: 25, bottom: 40, left: 45 },
      xAxis: {
        type: "category",
        data: periods,
        axisLabel: { color: "#6b5e4a", fontSize: 11 },
        axisLine: { lineStyle: { color: "#e0d8c8" } },
      },
      yAxis: {
        type: "value",
        name: "诗作数",
        nameTextStyle: { color: "#9b8e7a", fontSize: 10 },
        axisLabel: { color: "#9b8e7a" },
        splitLine: { lineStyle: { color: "#f0ebe0" } },
      },
      series: [
        {
          type: "bar",
          data: periods.map((pd, i) => ({
            value: data?.by_period[pd] ?? 0,
            itemStyle: { color: PERIOD_COLORS[i], borderRadius: [6, 6, 0, 0] },
          })),
          barWidth: "46%",
          label: { show: true, position: "top", color: "#2c2416", fontSize: 12, fontWeight: "bold" },
        },
      ],
    };
  }, [data]);

  const poems = useMemo(() => {
    const list = data?.poems ?? [];
    return filter ? list.filter((p) => p.period === filter) : list;
  }, [data, filter]);

  if (!data) {
    return <p className="py-10 text-center text-sm text-ink-muted">加载中…</p>;
  }

  const sentaCount = (label: string) => data.poems.filter((p) => p.senta_label === label).length;
  const authorTop = Object.entries(
    data.poems.reduce<Record<string, number>>((acc, p) => {
      acc[p.author] = (acc[p.author] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 数据要点 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { v: `${data.total}`, l: "含「中兴」的诗作" },
          { v: "第 3", l: "全语料词频排名" },
          { v: "29 / 21", l: "消极 / 积极（Senta）" },
          { v: "杜甫 14 首", l: "最高频诗人" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-line bg-card p-4 text-center shadow-[0_2px_12px_rgba(44,36,22,0.08)]">
            <div className="font-heading text-2xl font-black text-accent md:text-3xl">{s.v}</div>
            <div className="mt-1 text-xs text-ink-soft">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 时期分布图 */}
        <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_2px_12px_rgba(44,36,22,0.08)]">
          <h4 className="mb-3 font-heading text-base font-bold text-ink">「中兴」出现的时期分布</h4>
          <EChart option={option} className="h-[280px] w-full" />
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            肃宗—代宗寄望中兴（15 首）→ 德宗—宪宗一度沉寂（2 首）→ 武宗—哀帝末期反而激增（24 首）：
            王朝将亡，呼唤「中兴」愈发迫切，却始终未成。
          </p>
        </div>

        {/* 方法学注记 */}
        <div className="flex flex-col justify-between rounded-2xl border border-line bg-card p-5 shadow-[0_2px_12px_rgba(44,36,22,0.08)]">
          <div>
            <h4 className="mb-2 font-heading text-base font-bold text-ink">从被过滤到回归主题：「中兴」的标注修正</h4>
            <ul className="list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-ink-soft">
              <li>
                <strong className="text-ink">原缺席原因</strong>：jieba 默认把「中兴」标注为 <code>ns（地名）</code>，而 LDA 主题建模只保留名词（<code>n/nz/vn</code>），因此被词性过滤剔除——第 3 高频的政治关键词曾从主题中整体「消失」。
              </li>
              <li>
                <strong className="text-ink">标注修正</strong>：在自定义词典中将「中兴」人工标注为 <strong className="text-ink">n（名词）</strong>，重新分词、重新建模后，「中兴」进入全部四个时期的 LDA 主题词表。
              </li>
              <li>
                <strong className="text-ink">主题证据</strong>：肃宗—代宗主题「乾坤·幕府·浮云·<b className="text-ink">中兴</b>」；穆宗—文宗主题「<b className="text-ink">中兴</b>·清宫·渔阳」「天子·<b className="text-ink">中兴</b>·珊瑚」；武宗—哀帝三个主题均含「中兴」，其中「中兴」以 13.1 的权重居首。
              </li>
            </ul>
          </div>
          <div className="mt-4 rounded-xl bg-paper-deep p-3 text-[13px] leading-relaxed text-ink-soft">
            <strong className="text-accent">「未完成」的含义</strong>：杜甫「中兴诸将收山东」、肃宗以「中兴」为号，唐人四十余年反复呼唤中兴，然终唐之世未再复兴——中晚唐诗中的「中兴」，始终是未完成的期待。
          </div>
        </div>
      </div>

      {/* 诗句列表 */}
      <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_2px_12px_rgba(44,36,22,0.08)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h4 className="font-heading text-base font-bold text-ink">含「中兴」的诗句（{poems.length} / {data.total}）</h4>
          <select
            aria-label="时期筛选"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-9 rounded-lg border border-line bg-paper px-3 text-sm text-ink outline-none transition-colors focus:border-accent"
          >
            <option value="">全部时期</option>
            {PERIODS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {poems.map((p) => {
            const pi = Math.max(0, PERIODS.indexOf(p.period));
            return (
              <div key={p.id} className="rounded-xl border border-line bg-paper p-3.5 transition-shadow hover:shadow-[0_4px_16px_rgba(44,36,22,0.12)]">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded px-2 py-0.5 font-medium" style={{ background: `${PERIOD_COLORS[pi]}22`, color: PERIOD_COLORS[pi] }}>
                    {p.period || "未归期"}
                  </span>
                  <span className="text-ink-soft">{p.author}</span>
                  <span className="ml-auto">{sentimentEmoji(p.senta)} {p.senta_label}</span>
                </div>
                <div className="mt-1.5 font-heading text-sm font-bold text-ink">{p.title}</div>
                {p.line && (
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
                    <mark className="rounded bg-[rgba(184,134,11,0.3)] px-0.5 text-inherit">「{p.line}」</mark>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
