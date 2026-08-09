"use client";

import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { goWithTransition, type TransitionMode } from "@/components/tang-transition";

interface DeckContextValue {
  index: number;
  total: number;
  goTo: (i: number, mode?: TransitionMode) => void;
  next: (mode?: TransitionMode) => void;
  prev: (mode?: TransitionMode) => void;
}

const DeckContext = createContext<DeckContextValue | null>(null);

export function useDeck() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDeck must be used within DeckProvider");
  return ctx;
}

/**
 * Deck 状态 Provider：管理当前屏与转场。
 * Deck / BottomNav / TangTransition 等所有需要 useDeck 的组件都应在其内部。
 */
export function DeckProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);

  const clamp = useCallback((i: number) => Math.max(0, Math.min(total - 1, i)), [total]);

  const goTo = useCallback(
    (i: number, mode: TransitionMode = "baoxiang") => {
      if (busy || total === 0) return;
      const target = clamp(i);
      if (target === index) return;
      setBusy(true);
      goWithTransition({ mode, index: target });
    },
    [busy, total, clamp, index]
  );

  const next = useCallback(
    (mode: TransitionMode = "baoxiang") => goTo(index + 1, mode),
    [goTo, index]
  );
  const prev = useCallback(
    (mode: TransitionMode = "axe") => goTo(index - 1, mode),
    [goTo, index]
  );

  useEffect(() => {
    const onSwitched = (e: Event) => {
      const d = (e as CustomEvent<{ index?: number }>).detail;
      if (typeof d?.index === "number") setIndex(clamp(d.index));
      setBusy(false);
    };
    const onTotal = (e: Event) => {
      const d = (e as CustomEvent<{ total?: number }>).detail;
      if (typeof d?.total === "number" && d.total > 0) setTotal(d.total);
    };
    window.addEventListener("monumoir:tang-switched", onSwitched);
    window.addEventListener("monumoir:deck-total", onTotal);
    return () => {
      window.removeEventListener("monumoir:tang-switched", onSwitched);
      window.removeEventListener("monumoir:deck-total", onTotal);
    };
  }, [clamp]);

  return (
    <DeckContext.Provider value={{ index, total, goTo, next, prev }}>
      {children}
    </DeckContext.Provider>
  );
}

/**
 * 多屏容器：所有屏常驻 DOM（visibility 切换，保证隐藏屏中 ECharts 尺寸正常）。
 */
export function Deck({ children }: { children: ReactNode }) {
  const { index, total, goTo } = useDeck();
  const screens = Children.toArray(children);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("monumoir:deck-total", { detail: { total: screens.length } })
    );
  }, [screens.length]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#101010]">
      {screens.map((screen, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            visibility: i === index ? "visible" : "hidden",
            opacity: i === index ? 1 : 0,
            pointerEvents: i === index ? "auto" : "none",
          }}
        >
          {screen}
        </div>
      ))}
    </div>
  );
}

/**
 * 全屏屏壳：标题 + 内容（屏内可滚动）+ 底部「下一屏」。
 */
export function Screen({
  num,
  title,
  subtitle,
  dark = false,
  children,
  nextLabel = "下一屏",
  showNext = true,
  className = "",
}: {
  num?: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
  children: ReactNode;
  nextLabel?: string;
  showNext?: boolean;
  className?: string;
}) {
  const { next, index, total } = useDeck();
  const isLast = total > 0 && index === total - 1;
  return (
    <div
      className={`relative h-full w-full overflow-y-auto ${
        dark ? "bg-[#101010] text-white" : "bg-paper text-ink"
      }`}
    >
      <div className="mx-auto flex min-h-full w-full max-w-[1200px] flex-col px-4 py-8 md:px-6 md:py-10">
        {title && (
          <header className="mb-6 shrink-0 text-center md:mb-8">
            {num && (
              <span
                className={`mb-1 inline-block text-[11px] font-semibold tracking-[0.3em] ${
                  dark ? "text-[#c44d4d]" : "text-accent"
                }`}
              >
                {num}
              </span>
            )}
            <h2
              className={`font-heading text-2xl font-bold tracking-wide md:text-4xl ${
                dark ? "text-white" : "text-ink"
              }`}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className={`mx-auto mt-2 max-w-[640px] text-[13px] leading-relaxed md:text-sm ${
                  dark ? "text-white/60" : "text-ink-soft"
                }`}
              >
                {subtitle}
              </p>
            )}
          </header>
        )}
        <div className={`flex-1 ${className}`}>{children}</div>
        {showNext && !isLast && (
          <footer className="mt-6 flex shrink-0 items-center justify-between">
            <span className="text-xs text-ink-muted">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => next()}
              className="group flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft/60 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
            >
              {nextLabel}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
