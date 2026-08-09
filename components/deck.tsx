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
import { TangPattern, type TangMotif } from "@/components/tang-pattern";

interface DeckContextValue {
  index: number;
  total: number;
  registerTotal: (n: number) => void;
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
  const registerTotal = useCallback((n: number) => {
    setTotal((prev) => (prev === n ? prev : n));
  }, []);

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
    window.addEventListener("monumoir:tang-switched", onSwitched);
    return () => window.removeEventListener("monumoir:tang-switched", onSwitched);
  }, [clamp]);

  // 转场保险：若 5 秒内未收到 tang-switched，强制解除忙碌，避免界面卡死
  useEffect(() => {
    if (!busy) return;
    const t = window.setTimeout(() => setBusy(false), 5000);
    return () => window.clearTimeout(t);
  }, [busy]);

  return (
    <DeckContext.Provider value={{ index, total, registerTotal, goTo, next, prev }}>
      {children}
    </DeckContext.Provider>
  );
}

/**
 * 多屏容器：所有屏常驻 DOM（visibility 切换，保证隐藏屏中 ECharts 尺寸正常）。
 */
function hasInternalScroll() {
  const screen = [...document.querySelectorAll('[style*="visibility: visible"]')].find(
    (el) => el.getBoundingClientRect().width > 100 && el.getBoundingClientRect().height > 100
  );
  if (!screen) return false;
  return [...screen.querySelectorAll("[class*='overflow-y-auto']")].some(
    (el) => el.scrollHeight > el.clientHeight + 8
  );
}

export function Deck({ children }: { children: ReactNode }) {
  const { index, registerTotal, next, prev } = useDeck();
  const screens = Children.toArray(children);

  useEffect(() => {
    registerTotal(screens.length);
  }, [screens.length, registerTotal]);

  // 滚轮 / 触摸滑动切换界面
  useEffect(() => {
    let touchY = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 24) return;
      const t = e.target as HTMLElement | null;
      // 优先：鼠标下的可滚动容器；其次：当前屏内任意可滚动容器
      let scroller = t?.closest
        ? (t.closest("[class*='overflow-y-auto']") as HTMLElement | null)
        : null;
      if (!scroller || scroller.scrollHeight <= scroller.clientHeight + 8) {
        const vis = [...document.querySelectorAll('[style*="visibility: visible"]')].find(
          (el) => el.children.length && el.getBoundingClientRect().width > 100 && el.getBoundingClientRect().height > 100
        );
        scroller = vis
          ? ([...vis.querySelectorAll("[class*='overflow-y-auto']")] as HTMLElement[]).find(
              (el) => el.scrollHeight > el.clientHeight + 8
            ) ?? null
          : null;
      }
      if (scroller && scroller.scrollHeight > scroller.clientHeight + 8) {
        const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 8;
        const atTop = scroller.scrollTop <= 8;
        const canDown = e.deltaY > 0 && !atBottom;
        const canUp = e.deltaY < 0 && !atTop;
        if (canDown || canUp) {
          e.preventDefault();
          scroller.scrollTop += e.deltaY;
          return;
        }
      }
      // 无内部滚动（或已到边界）→ 切换界面
      if (e.deltaY > 0) next("ribbon");
      else prev("axe");
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dy) < 60) return;
      // 屏内有可滚动内容时，触摸留给内部滚动（避免误切屏）
      if (hasInternalScroll()) return;
      if (dy < 0) next("ribbon");
      else prev("axe");
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prev]);

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
  pattern,
  children,
  nextLabel = "下一屏",
  showNext = true,
  className = "",
}: {
  num?: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
  pattern?: TangMotif;
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
      {pattern && <TangPattern motif={pattern} dark={dark} />}
      <div className="relative mx-auto flex min-h-full w-full max-w-[1200px] flex-col px-4 py-8 md:px-6 md:py-10">
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
