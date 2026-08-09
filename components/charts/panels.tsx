"use client";

import * as echarts from "echarts";
import { useEffect, useState } from "react";
import { EChart } from "@/components/chart";
import { ChevronDownIcon } from "@/components/icons";
import {
  BASE_PATH,
  fetchJson,
  PERIOD_COLORS,
  PERIOD_ORDER,
  type BubblePeriod,
  type TopicItem,
  type TopicsData,
  type WordItem,
} from "@/lib/data";

import { StickerImage } from "@/components/originkit/sticker-image";
function ExpandablePanel({
  title,
  emoji,
  children,
  defaultOpen = false,
}: {
  title: string;
  emoji?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`art-card rounded-2xl p-5 ${open ? "panel-open" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-[15px] font-medium text-accent">
          {emoji && <span className="mr-1.5">{emoji}</span>}
          {title}
        </span>
        <ChevronDownIcon className="panel-chevron h-4 w-4 shrink-0 text-ink-soft" />
      </button>
      <div
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <div className="mt-4 border-t border-line pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** 模块 7：LDA 主题详情表 */
export function TopicPanel() {
  const [data, setData] = useState<TopicsData | null>(null);
  useEffect(() => {
    fetchJson<TopicsData>("/data/topics.json").then(setData).catch(console.error);
  }, []);

  const pclass = ["p1", "p2", "p3", "p4"];

  return (
    <ExpandablePanel title="LDA 主题详情（8 词/主题）" emoji="📋">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-line bg-paper-deep p-2 text-left font-medium">时期</th>
              <th className="border-b border-line bg-paper-deep p-2 text-left font-medium">主题</th>
              <th className="border-b border-line bg-paper-deep p-2 text-left font-medium">核心词（8 词）</th>
            </tr>
          </thead>
          <tbody>
            {(data?.topics ?? []).map((t: TopicItem, i: number) => {
              const pdIdx = data ? data.periods.indexOf(t.period) : -1;
              return (
                <tr key={i} className="border-b border-paper-deep">
                  <td className="p-2">
                    <span
                      className="rounded px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: `rgba(${pdIdx >= 0 ? PERIOD_COLORS[pdIdx % 4].match(/\d+/g)?.join(",") ?? "139,26,26" : "139,26,26"},0.12)`,
                        color: PERIOD_COLORS[Math.max(0, pdIdx) % 4],
                      }}
                    >
                      {t.period}
                    </span>
                  </td>
                  <td className="p-2">主题{parseInt(t.topic_id) + 1}</td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {t.core_words.map((w, wi) => (
                        <span key={wi} className="rounded bg-[rgba(139,26,26,0.08)] px-1.5 py-0.5 text-xs text-accent">
                          {w}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ExpandablePanel>
  );
}

/** 模块 8：高频词与情感分值表 */
export function WordPanel() {
  const [data, setData] = useState<WordItem[] | null>(null);
  useEffect(() => {
    fetchJson<{ top_words: WordItem[] }>("/data/word_data.json")
      .then((d) => setData(d.top_words))
      .catch(console.error);
  }, []);

  const cls = (s: number) => (s > 0.05 ? "text-[#b8860b]" : s < -0.05 ? "text-[#8b1a1a]" : "text-[#9b8e7a]");
  const label = (s: number) => (s > 0.05 ? "正向" : s < -0.05 ? "负向" : "中性");

  return (
    <ExpandablePanel title="高频词与情感分值" emoji="📊">
      <div className="max-h-[420px] overflow-y-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead className="sticky top-0">
            <tr>
              <th className="border-b border-line bg-paper-deep p-2 text-left font-medium">#</th>
              <th className="border-b border-line bg-paper-deep p-2 text-left font-medium">词</th>
              <th className="border-b border-line bg-paper-deep p-2 text-left font-medium">频次</th>
              <th className="border-b border-line bg-paper-deep p-2 text-left font-medium">情感分值</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((w, i) => (
              <tr key={i} className="border-b border-paper-deep">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{w.word}</td>
                <td className="p-2">{w.freq}</td>
                <td className={`p-2 font-medium ${cls(w.sentiment)}`}>
                  {w.sentiment.toFixed(2)} {label(w.sentiment)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ExpandablePanel>
  );
}

/** 模块 9：四时期词频气泡图（每时期一个力导向图） */
function BubbleForce({ period, color }: { period: BubblePeriod; color: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const option: echarts.EChartsOption = {
    animationDuration: 700,
    tooltip: {
      trigger: "item",
      formatter: (p: unknown) => {
        const d = p as { data?: { freq?: number; count?: number; name?: string } };
        if (d.data?.freq) return `<b>${d.data.name}</b><br/>频率: ${d.data.freq}次`;
        if (d.data?.count) return `<b>${d.data.name}</b><br/>使用: ${d.data.count}次`;
        return d.data?.name ?? "";
      },
    },
    series: [
      {
        type: "graph",
        layout: "force",
        force: { repulsion: 180, gravity: 0.08, edgeLength: [60, 180] },
        roam: true,
        draggable: true,
        categories: [{ name: "词" }, { name: "诗人" }],
        data: period.words.slice(0, 10).flatMap((w, wi) => {
          const wordNode = {
            id: w.word,
            name: w.word,
            symbolSize: 16 + w.freq * 1.2,
            category: 0,
            itemStyle: { color },
            label: { show: true, fontSize: 10 + w.freq * 0.15, fontWeight: "bold" as const },
            freq: w.freq,
          };
          const poets = w.poets.slice(0, 6).map((po) => ({
            id: `${w.word}_${po.name}`,
            name: po.name,
            symbolSize: 4 + po.count * 1.5,
            category: 1,
            itemStyle: { color: `hsl(${200 + wi * 30},50%,60%)` },
            label: { show: po.count >= 3, fontSize: 8, color: "#6b5e4a" },
            count: po.count,
          }));
          return [wordNode, ...poets];
        }),
        links: period.words.slice(0, 10).flatMap((w) =>
          w.poets.slice(0, 6).map((po) => ({ source: w.word, target: `${w.word}_${po.name}` }))
        ),
        label: { show: true, position: "right", fontSize: 9, color: "#2c2416" },
        lineStyle: { color: "#e0d8c8", curveness: 0.2, opacity: 0.5 },
        emphasis: { focus: "adjacency", lineStyle: { width: 2, opacity: 0.8 } },
      },
    ],
  };

  if (!ready) return <div className="h-[360px] w-full" />;
  return <EChart option={option} className="h-[360px] w-full" />;
}

export function BubbleGrid() {
  const [data, setData] = useState<BubblePeriod[] | null>(null);
  useEffect(() => {
    fetchJson<{ periods: BubblePeriod[] }>("/data/period_bubbles.json")
      .then((d) => setData(d.periods))
      .catch(console.error);
  }, []);

  return (
    <div className="flex gap-6 overflow-x-auto pb-2">
      {(data ?? []).map((pd, pi) => (
        <div key={pi} className="min-w-[360px] flex-1">
          <div className="mb-1 text-sm font-bold" style={{ color: PERIOD_COLORS[pi] }}>
            {pd.period}（{pd.poem_count} 首）
          </div>
          <BubbleForce period={pd} color={PERIOD_COLORS[pi]} />
        </div>
      ))}
    </div>
  );
}

export function BubblePanel() {
  return (
    <ExpandablePanel title="四时期词频气泡图 · 词+诗人" emoji="🫧">
      <BubbleGrid />
    </ExpandablePanel>
  );
}

/** 模块 10：四阶段词云 */
export function WordcloudPanel() {
  return (
    <ExpandablePanel title="四阶段词云" emoji="☁️">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {["肃宗—代宗", "德宗—宪宗", "穆宗—文宗", "武宗—哀帝"].map((label, i) => (
          <figure key={label}>
            <figcaption
              className="mb-2 text-sm font-bold"
              style={{ color: PERIOD_COLORS[i] }}
            >
              {label}
            </figcaption>
            <StickerImage
              src={`${BASE_PATH}/img/wordcloud_${i}.png`}
              alt={`${label} 词云`}
              width={360}
              height={273}
            />
          </figure>
        ))}
      </div>
    </ExpandablePanel>
  );
}

/** 模块 11：LDA 主题间距离图 */
export function IntertopicPanel() {
  return (
    <ExpandablePanel title="LDA 主题间距离图" emoji="🔬">
      <StickerImage
        src={`${BASE_PATH}/img/intertopic_map.png`}
        alt="LDA 主题间距离图"
        width={420}
        height={361}
      />
    </ExpandablePanel>
  );
}

export { PERIOD_ORDER };
