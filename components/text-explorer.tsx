"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchJson, PERIOD_COLORS, PERIOD_ORDER, type TextEntry } from "@/lib/data";
import InfiniteGallery from "@/components/originkit/ui/infinitegallery";

const PERIODS = ["肃宗—代宗", "德宗—宪宗", "穆宗—文宗", "武宗—哀帝"];

function sentimentEmoji(s: number) {
  return s > 0.05 ? "🟢" : s < -0.05 ? "🔴" : "⚪";
}

function escapeHtml(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function poemCardHtml(p: TextEntry): string {
  const periodColor = PERIOD_COLORS[PERIOD_ORDER[p.period] ?? 0] ?? "#AA967E";
  const emoji = p.sentiment > 0.05 ? "🟢" : p.sentiment < -0.05 ? "🔴" : "⚪";
  const label = p.sentiment_label || "中性";
  const first = (p.text || "").replace(/\n+/g, " ").trim().slice(0, 36);
  const author = p.author || "佚名";
  const title = p.title || "无题";
  const period = p.period || "未归期";
  return `<div style="width:100%;height:100%;background:#FDFCFA;border:1px solid rgba(170,150,126,0.35);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 4px 14px rgba(53,71,95,0.08);">
  <div style="height:6px;background:${periodColor};flex:none;"></div>
  <div style="padding:10px 12px 8px;flex:1;display:flex;flex-direction:column;gap:4px;min-height:0;">
    <div style="font-family:'Noto Serif SC',serif;font-size:14px;font-weight:700;color:#35475F;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(title)}</div>
    <div style="font-size:11px;color:#5F2C21;">${escapeHtml(author)} · ${escapeHtml(period)}</div>
    <div style="font-size:11px;color:${periodColor};">${emoji} ${label}　正${p.positive_words ?? 0} / 负${p.negative_words ?? 0}</div>
    <div style="margin-top:auto;font-size:11px;line-height:1.5;color:#AA967E;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(first)}</div>
  </div>
</div>`;
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="rounded bg-[rgba(191,133,103,0.22)] px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function TextExplorer() {
  const [texts, setTexts] = useState<TextEntry[] | null>(null);
  const [period, setPeriod] = useState("");
  const [attitude, setAttitude] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJson<TextEntry[]>("/data/texts.json").then(setTexts).catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (texts ?? []).filter((t) => {
      const matchPeriod = !period || t.period === period;
      let matchSentiment = true;
      if (attitude === "pos") matchSentiment = t.sentiment > 0.05;
      else if (attitude === "neg") matchSentiment = t.sentiment < -0.05;
      else if (attitude === "neu") matchSentiment = Math.abs(t.sentiment) <= 0.05;
      const matchSearch =
        !q ||
        t.text.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.source.toLowerCase().includes(q);
      return matchPeriod && matchSentiment && matchSearch;
    });
  }, [texts, period, attitude, search]);

  const galleryImages = useMemo(() => {
    return filtered.slice(0, 72).map((p) => ({
      src: "",
      alt: p.title || p.author || "诗卡",
      content: poemCardHtml(p),
    }));
  }, [filtered]);

  return (
    <div>
      {/* 筛选栏 */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-line bg-card p-4 shadow-[0_2px_12px_rgba(53,71,95,0.06)] md:flex-row md:items-center">
        <select
          aria-label="时期筛选"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="h-10 flex-1 rounded-lg border border-line bg-paper px-3 text-sm text-ink outline-none transition-colors focus:border-accent"
        >
          <option value="">全部时期</option>
          {PERIODS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          aria-label="情感筛选"
          value={attitude}
          onChange={(e) => setAttitude(e.target.value)}
          className="h-10 flex-1 rounded-lg border border-line bg-paper px-3 text-sm text-ink outline-none transition-colors focus:border-accent"
        >
          <option value="">全部情感</option>
          <option value="pos">正向（情感值 &gt; 0）</option>
          <option value="neg">负向（情感值 &lt; 0）</option>
          <option value="neu">中性（情感值 ≈ 0）</option>
        </select>
        <input
          type="text"
          aria-label="自由检索"
          placeholder="搜索作者、标题、正文…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 flex-1 rounded-lg border border-line bg-paper px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-accent"
        />
        <span className="shrink-0 text-xs text-ink-muted">
          {filtered.length} / {texts?.length ?? 0} 条
        </span>
      </div>

      {/* 动效画廊：InfiniteGallery 诗卡 */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-line bg-paper-deep shadow-[0_2px_12px_rgba(53,71,95,0.06)]">
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <p className="text-xs text-ink-muted">
            ✨ 诗卡画廊 · 当前筛选 {filtered.length} 首（展示前 {galleryImages.length} 首）—— 拖动 / 滚轮缩放浏览
          </p>
        </div>
        <InfiniteGallery
          images={galleryImages}
          cardContent={(img) => img.content ?? ""}
          density={6}
          imageWidth={196}
          imageHeight={156}
          rounded={8}
          dragSpeed={24}
          driftAmount={5}
          friction={8}
          backgroundColor="#E7E2D8"
          width="100%"
          height={460}
          style={{ minWidth: 0, minHeight: 0 }}
          className="w-full"
        />
      </div>

      {/* 结果列表 */}
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-muted">无匹配结果</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((t) => {
            const pdIdx = PERIOD_ORDER[t.period] ?? 0;
            return (
              <article
                key={t.id}
                className="rounded-2xl border border-line bg-card p-5 shadow-[0_2px_12px_rgba(53,71,95,0.06)] transition-shadow hover:shadow-[0_8px_32px_rgba(53,71,95,0.10)]"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-heading text-[15px] font-bold text-ink">{t.author}</span>
                  <span
                    className="rounded px-2 py-0.5 text-xs font-medium"
                    style={{ background: `${PERIOD_COLORS[pdIdx]}22`, color: PERIOD_COLORS[pdIdx] }}
                  >
                    {t.period || ""}
                  </span>
                  <span className="text-ink-soft">
                    {sentimentEmoji(t.sentiment)} {t.sentiment_label || ""}（{t.sentiment}）
                  </span>
                  {t.genre && <span className="text-ink-muted">{t.genre}</span>}
                  {t.source && <span className="text-ink-muted">{t.source}</span>}
                </div>
                <div className="mt-2 text-sm font-medium text-ink">{t.title}</div>
                <p className="mt-2 line-clamp-4 whitespace-pre-line text-[13px] font-light leading-[1.9] text-ink-soft">
                  {highlight(t.text, search.trim())}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-[rgba(191,133,103,0.12)] px-2 py-0.5 font-medium text-[#BF8567]">
                    正{t.positive_words || 0}
                  </span>
                  <span className="rounded bg-[rgba(121,23,22,0.10)] px-2 py-0.5 font-medium text-[#791716]">
                    负{t.negative_words || 0}
                  </span>
                  <span className="rounded bg-[rgba(95,44,33,0.08)] px-2 py-0.5 font-medium text-[#5F2C21]">
                    归因 {t.blame_target || "其他"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
