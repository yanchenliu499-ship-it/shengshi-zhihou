"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { fetchJson, PERIOD_COLORS, PERIOD_ORDER, type TextEntry } from "@/lib/data";

const PERIODS = ["肃宗—代宗", "德宗—宪宗", "穆宗—文宗", "武宗—哀帝"];

function escapeHtml(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

/* ── 书签纹样触发标签 ── */
function BookmarkTab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group fixed right-0 top-[35%] z-40 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 outline-none"
      aria-label="打开文本探索器"
    >
      {/* 书签主体 */}
      <svg
        viewBox="0 0 52 180"
        width="52"
        height="180"
        className="drop-shadow-[0_4px_16px_rgba(53,71,95,0.15)] transition-transform duration-300 group-hover:translate-x-[-4px]"
        aria-hidden="true"
      >
        {/* 书签底色 + 渐变 */}
        <defs>
          <linearGradient id="bm-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#791716" />
            <stop offset="100%" stopColor="#BF8567" />
          </linearGradient>
          <filter id="bm-shadow">
            <feDropShadow dx="-2" dy="2" stdDeviation="4" floodColor="#35475F" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* 书签主体形状 */}
        <path
          d="M4 0h40l4 12v152l-22-8-22 8V12z"
          fill="url(#bm-grad)"
          stroke="#FDFCFA"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#bm-shadow)"
        />

        {/* 顶部菱形装饰 */}
        <polygon
          points="24,28 30,34 24,40 18,34"
          fill="none"
          stroke="#FDFCFA"
          strokeWidth="1"
          opacity="0.7"
        />

        {/* 竖排文字：文本探索 */}
        <text
          x="26"
          y="68"
          textAnchor="middle"
          fontFamily="'Noto Serif SC', 'Songti SC', serif"
          fontWeight="600"
          fontSize="14"
          fill="#FDFCFA"
          letterSpacing="0.15em"
          opacity="0.95"
        >
          文
        </text>
        <text
          x="26"
          y="88"
          textAnchor="middle"
          fontFamily="'Noto Serif SC', 'Songti SC', serif"
          fontWeight="600"
          fontSize="14"
          fill="#FDFCFA"
          letterSpacing="0.15em"
          opacity="0.95"
        >
          本
        </text>
        <text
          x="26"
          y="108"
          textAnchor="middle"
          fontFamily="'Noto Serif SC', 'Songti SC', serif"
          fontWeight="600"
          fontSize="14"
          fill="#FDFCFA"
          letterSpacing="0.15em"
          opacity="0.95"
        >
          探
        </text>
        <text
          x="26"
          y="128"
          textAnchor="middle"
          fontFamily="'Noto Serif SC', 'Songti SC', serif"
          fontWeight="600"
          fontSize="14"
          fill="#FDFCFA"
          letterSpacing="0.15em"
          opacity="0.95"
        >
          索
        </text>

        {/* 底部燕尾回纹 */}
        <path
          d="M8 160h8l2-4h12l2 4h8"
          fill="none"
          stroke="#FDFCFA"
          strokeWidth="0.8"
          opacity="0.5"
        />
        <circle cx="24" cy="152" r="1.2" fill="#FDFCFA" opacity="0.5" />
      </svg>

      {/* hover 提示文字 */}
      <span className="absolute -right-1 top-1/2 -translate-y-1/2 translate-x-full whitespace-nowrap rounded bg-[#1C2330]/85 px-2 py-1 text-[10px] text-[#FDFCFA] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        文本探索
      </span>
    </button>
  );
}

/* ── 纹样头部装饰 ── */
function PanelHeader() {
  return (
    <div className="pointer-events-none select-none" aria-hidden="true">
      {/* 顶部色带 */}
      <div
        className="h-1 w-full"
        style={{
          background: "linear-gradient(to right, #791716, #BF8567, #AA967E, transparent)",
        }}
      />
      {/* 纹样头 */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        {/* 菱形纹样 */}
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
          <polygon
            points="16,2 30,16 16,30 2,16"
            fill="none"
            stroke="#791716"
            strokeWidth="1"
            opacity="0.5"
          />
          <polygon
            points="16,8 24,16 16,24 8,16"
            fill="none"
            stroke="#BF8567"
            strokeWidth="0.8"
            opacity="0.5"
          />
          <circle cx="16" cy="16" r="2" fill="#791716" opacity="0.7" />
        </svg>
        <div>
          <p className="font-heading text-sm font-bold tracking-[0.2em] text-[#791716]">文本探索器</p>
          <p className="text-[10px] tracking-wider text-[#AA967E]">逐条浏览 · 按时期/态度筛选 · 自由检索</p>
        </div>
        {/* 右侧卷草装饰线 */}
        <div className="ml-auto flex items-center gap-1 opacity-30">
          <div className="h-[1px] w-8 bg-[#BF8567]" />
          <div className="h-[1px] w-4 bg-[#AA967E]" />
          <div className="h-[1px] w-2 bg-[#AA967E]" />
        </div>
      </div>
      <div className="mx-5 h-[1px] bg-[rgba(170,150,126,0.25)]" />
    </div>
  );
}

export function TextExplorer() {
  const [open, setOpen] = useState(false);
  const [texts, setTexts] = useState<TextEntry[] | null>(null);
  const [period, setPeriod] = useState("");
  const [attitude, setAttitude] = useState("");
  const [search, setSearch] = useState("");
  const [selectedPoem, setSelectedPoem] = useState<TextEntry | null>(null);

  useEffect(() => {
    fetchJson<TextEntry[]>("/data/texts.json").then(setTexts).catch(console.error);
  }, []);

  // 打开弹窗时锁住页面滚动
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedPoem) setSelectedPoem(null);
        else setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPoem]);

  // 支持外部（如 Deck 文本探索器引导页）通过事件打开面板
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("text-explorer:open", onOpen);
    return () => window.removeEventListener("text-explorer:open", onOpen);
  }, []);

  const openPanel = useCallback(() => setOpen(true), []);
  const closePanel = useCallback(() => {
    setOpen(false);
    setSelectedPoem(null);
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

  return (
    <>
      {/* 页面中书签触发按钮 — 仅关闭时显示 */}
      {!open && <BookmarkTab onClick={openPanel} />}

      {/* 右侧弹窗遮罩 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          onClick={(e) => { if (e.target === e.currentTarget) closePanel(); }}
        >
          {/* 半透明遮罩 */}
          <div className="absolute inset-0 bg-[rgba(28,35,48,0.45)] backdrop-blur-[2px]" />

          {/* 弹窗面板 */}
          <div className="relative z-10 flex h-full w-full max-w-[640px] flex-col bg-[#FDFCFA] shadow-[-8px_0_40px_rgba(53,71,95,0.15)] animate-slide-in-right">
            {/* 纹样头 */}
            <PanelHeader />

            {/* 关闭按钮 */}
            <button
              type="button"
              onClick={closePanel}
              className="absolute right-4 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full text-[#AA967E] transition-colors hover:bg-[rgba(121,23,22,0.08)] hover:text-[#791716]"
              aria-label="关闭"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>

            {/* 筛选栏 */}
            <div className="flex flex-col gap-2 px-5 py-3 md:flex-row md:items-center">
              <select
                aria-label="时期筛选"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="h-9 flex-1 rounded border border-[rgba(170,150,126,0.35)] bg-[#FDFCFA] px-3 text-xs text-[#35475F] outline-none transition-colors focus:border-[#791716]"
              >
                <option value="">全部时期</option>
                {PERIODS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                aria-label="情感筛选"
                value={attitude}
                onChange={(e) => setAttitude(e.target.value)}
                className="h-9 flex-1 rounded border border-[rgba(170,150,126,0.35)] bg-[#FDFCFA] px-3 text-xs text-[#35475F] outline-none transition-colors focus:border-[#791716]"
              >
                <option value="">全部情感</option>
                <option value="pos">正向</option>
                <option value="neg">负向</option>
                <option value="neu">中性</option>
              </select>
              <input
                type="text"
                aria-label="自由检索"
                placeholder="搜索…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 flex-[2] rounded border border-[rgba(170,150,126,0.35)] bg-[#FDFCFA] px-3 text-xs text-[#35475F] outline-none transition-colors placeholder:text-[#AA967E] focus:border-[#791716]"
              />
              <span className="shrink-0 text-[10px] text-[#AA967E]">
                {filtered.length}/{texts?.length ?? 0}
              </span>
            </div>

            {/* 内容区 */}
            <div className="flex-1 overflow-y-auto px-5 pb-8">
              {filtered.length === 0 ? (
                <p className="py-16 text-center text-xs text-[#AA967E]">无匹配结果</p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filtered.map((t) => {
                    const pdIdx = PERIOD_ORDER[t.period] ?? 0;
                    return (
                      <article
                        key={t.id}
                        onClick={() => setSelectedPoem(t)}
                        className="cursor-pointer rounded border border-[rgba(170,150,126,0.25)] bg-[#FDFCFA] p-4 shadow-[0_1px_4px_rgba(53,71,95,0.04)] transition-all hover:border-[rgba(191,133,103,0.4)] hover:shadow-[0_4px_16px_rgba(53,71,95,0.08)]"
                      >
                        <div className="flex flex-wrap items-center gap-2 text-[10px]">
                          <span className="font-heading text-sm font-bold text-[#35475F]">{t.author}</span>
                          <span
                            className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                            style={{ background: `${PERIOD_COLORS[pdIdx]}18`, color: PERIOD_COLORS[pdIdx] }}
                          >
                            {t.period || ""}
                          </span>
                          <span className="text-[#5F2C21]">
                            {t.sentiment > 0.05 ? "▴" : t.sentiment < -0.05 ? "▾" : "—"} {t.sentiment_label || ""}
                          </span>
                          {t.genre && <span className="text-[#AA967E]">{t.genre}</span>}
                        </div>
                        <div className="mt-1 text-sm font-medium text-[#35475F]">{t.title}</div>
                        <p className="mt-1.5 line-clamp-3 whitespace-pre-line text-[12px] leading-[1.8] text-[#5F2C21]">
                          {highlight(t.text, search.trim())}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                          <span className="rounded bg-[rgba(191,133,103,0.10)] px-1.5 py-0.5 text-[#BF8567]">
                            +{t.positive_words || 0}
                          </span>
                          <span className="rounded bg-[rgba(121,23,22,0.08)] px-1.5 py-0.5 text-[#791716]">
                            −{t.negative_words || 0}
                          </span>
                          <span className="rounded bg-[rgba(95,44,33,0.06)] px-1.5 py-0.5 text-[#5F2C21]">
                            {t.blame_target || "其他"}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 底部纹样收尾 */}
            <div className="pointer-events-none select-none" aria-hidden="true">
              <div className="mx-5 h-[1px] bg-[rgba(170,150,126,0.25)]" />
              <div className="flex items-center justify-center gap-2 py-3">
                <div className="h-[1px] w-6 bg-[#AA967E] opacity-30" />
                <svg viewBox="0 0 16 16" width="10" height="10">
                  <polygon points="8,2 14,8 8,14 2,8" fill="none" stroke="#BF8567" strokeWidth="0.8" opacity="0.4" />
                </svg>
                <div className="h-[1px] w-6 bg-[#AA967E] opacity-30" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 诗歌详情弹窗 */}
      {selectedPoem && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(28,35,48,0.55)] p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedPoem(null); }}
        >
          <div className="relative max-h-[78vh] w-full max-w-[480px] overflow-y-auto rounded border border-[rgba(170,150,126,0.35)] bg-[#FDFCFA] p-6 shadow-[-4px_8px_32px_rgba(53,71,95,0.15)]">
            <button
              type="button"
              onClick={() => setSelectedPoem(null)}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-[#AA967E] transition-colors hover:bg-[rgba(121,23,22,0.08)] hover:text-[#791716]"
              aria-label="关闭"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>

            <div className="font-heading text-lg font-bold text-[#791716]">{selectedPoem.author}</div>
            <div className="mt-1 text-sm text-[#35475F]">
              {selectedPoem.title}
              {selectedPoem.source && (
                <span className="text-[11px] text-[#AA967E]">（{selectedPoem.source}）</span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-[#5F2C21]">
              <span className="rounded bg-[#E7E2D8] px-2 py-0.5">{selectedPoem.period}</span>
              <span className="rounded bg-[rgba(191,133,103,0.10)] px-2 py-0.5 text-[#BF8567]">
                情感 {selectedPoem.sentiment.toFixed(2)}
              </span>
            </div>

            <div className="mt-4 max-h-[240px] overflow-y-auto whitespace-pre-line rounded bg-[#E7E2D8] p-4 text-[13px] leading-[1.9] text-[#35475F]">
              {selectedPoem.text || "（正文截断）"}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
              <span className="rounded bg-[rgba(191,133,103,0.10)] px-2 py-1 text-[#BF8567]">
                正向词 {selectedPoem.positive_words}
              </span>
              <span className="rounded bg-[rgba(121,23,22,0.08)] px-2 py-1 text-[#791716]">
                负向词 {selectedPoem.negative_words}
              </span>
              <span className="rounded bg-[rgba(95,44,33,0.06)] px-2 py-1 text-[#5F2C21]">
                归因 {selectedPoem.blame_target || "其他"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 右侧滑入动画 */}
      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </>
  );
}
