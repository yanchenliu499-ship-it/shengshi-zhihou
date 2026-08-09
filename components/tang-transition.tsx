"use client";

import { useEffect, useRef, useState } from "react";
import {
  BaoxiangFlower,
  DaggerAxe,
  DunhuangRibbon,
} from "@/components/ornaments";
import AsciiFire from "@/components/originkit/ui/ascii-flame";

export type TransitionMode = "baoxiang" | "axe" | "ribbon";

type Phase = "idle" | "opening" | "switching" | "closing";

const OPEN_MS = 900;
const SWITCH_HOLD_MS = 700;
const CLOSE_MS = 620;

/**
 * 唐代风格点击转场（Deck 屏切换用）。
 * 监听 window 上的 monumoir:tang-go 事件：
 *   detail = { mode: "baoxiang"|"axe"|"ribbon", index?: number, target?: string }
 * - 提供 index：Deck 屏切换模式——覆盖期间派发 monumoir:tang-switched（含 index），由 Deck 切换当前屏
 * - 提供 target：旧式滚动模式——覆盖期间滚动到锚点
 */
export function TangTransition() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<TransitionMode>("baoxiang");
  const [pending, setPending] = useState<{ index?: number; target?: string } | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };
  const pushTimer = (t: number) => {
    timersRef.current.push(t);
    return t;
  };

  useEffect(() => {
    const onGo = (e: Event) => {
      const d = (e as CustomEvent<{ mode?: TransitionMode; index?: number; target?: string }>).detail || {};
      // 取消上一次转场的残留定时器，保证连续点击不会中断新转场
      clearTimers();
      setMode(d.mode || "baoxiang");
      setPending({ index: d.index, target: d.target });
      setPhase("opening");
    };
    window.addEventListener("monumoir:tang-go", onGo);
    return () => {
      window.removeEventListener("monumoir:tang-go", onGo);
      clearTimers();
    };
  }, []);

  const active = phase !== "idle";

  useEffect(() => {
    if (phase === "opening") {
      const t = pushTimer(window.setTimeout(() => setPhase("switching"), OPEN_MS));
      return () => window.clearTimeout(t);
    }
    if (phase === "switching") {
      const t = pushTimer(
        window.setTimeout(() => {
          if (pending?.index !== undefined) {
            window.dispatchEvent(
              new CustomEvent("monumoir:tang-switched", { detail: { index: pending.index } })
            );
          } else if (pending?.target) {
            const el = document.querySelector(pending.target);
            if (el) (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }
          setPhase("closing");
        }, SWITCH_HOLD_MS)
      );
      return () => window.clearTimeout(t);
    }
    if (phase === "closing") {
      const t = pushTimer(
        window.setTimeout(() => {
          setPhase("idle");
          setPending(null);
        }, CLOSE_MS)
      );
      return () => window.clearTimeout(t);
    }
  }, [phase, pending]);

  if (!active) return null;

  const expanding = phase === "opening";
  const hiding = phase === "closing";
  const shown = !expanding && !hiding;

  const ribbonOpacity = hiding ? 0 : expanding ? 0 : 1;

  return (
    <div
      className="fixed inset-0 z-[200]"
      aria-hidden="true"
      style={{ pointerEvents: phase === "switching" ? "auto" : "none" }}
    >
      {/* 深色幕布 */}
      <div
        className={`absolute inset-0 bg-[#101010] transition-opacity duration-500 ${
          expanding ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* 深红氛围 */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: hiding ? 0 : 1,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(139,26,26,0.30) 0%, transparent 62%)",
        }}
      />

      {/* ===== 中央转场元素（按 mode） ===== */}
      {mode === "baoxiang" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: hiding
                ? "scale(0) rotate(0deg)"
                : expanding
                  ? "scale(0.12) rotate(-120deg)"
                  : "scale(1) rotate(180deg)",
              opacity: expanding ? 0 : hiding ? 0 : 1,
            }}
          >
            <BaoxiangFlower className="h-[80vmin] w-[80vmin] text-[#b8860b]/95 drop-shadow-[0_0_50px_rgba(184,134,11,0.4)]" />
          </div>
        </div>
      )}

      {mode === "axe" && (
        <div className="absolute inset-0">
          {/* 左右两戈交叉合拢 / 分开 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="flex items-center justify-center gap-10 md:gap-16 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: expanding
                  ? "translateX(-120px) scale(0.7) rotate(-12deg)"
                  : hiding
                    ? "translateX(120px) scale(0.7) rotate(12deg)"
                    : "translateX(0) scale(1) rotate(0deg)",
                opacity: expanding ? 0 : hiding ? 0 : 1,
              }}
            >
              <DaggerAxe className="h-24 w-24 text-[#8b1a1a] drop-shadow-[0_0_24px_rgba(139,26,26,0.5)] md:h-32 md:w-32" />
              <DaggerAxe className="h-24 w-24 scale-x-[-1] text-[#c44d4d] drop-shadow-[0_0_24px_rgba(196,77,77,0.5)] md:h-32 md:w-32" />
            </div>
          </div>
          {/* 兵戈光带 */}
          <div
            className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#8b1a1a]/80 to-transparent transition-opacity duration-700"
            style={{ opacity: shown ? 1 : 0 }}
          />
        </div>
      )}

      {mode === "ribbon" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          <div
            className="transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: expanding ? "translateY(-60px) scaleX(0.2)" : "translateY(0) scaleX(1)",
              opacity: ribbonOpacity,
            }}
          >
            <DunhuangRibbon className="h-12 w-80 text-[#c4a86b]/90 md:h-16 md:w-[36rem]" />
          </div>
          <div
            className="transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: expanding ? "translateY(60px) scaleX(0.2)" : "translateY(0) scaleX(1)",
              opacity: ribbonOpacity,
            }}
          >
            <DunhuangRibbon className="h-12 w-80 rotate-180 text-[#c4a86b]/70 md:h-16 md:w-[36rem]" />
          </div>
          {/* 飘带间的小宝相花点缀 */}
          <BaoxiangFlower
            className={`h-24 w-24 text-[#b8860b] transition-opacity duration-700 ${shown ? "opacity-80" : "opacity-0"}`}
          />
        </div>
      )}

      {/* 底部火焰 */}
      <div className="absolute inset-x-0 bottom-0 h-40 opacity-75">
        <AsciiFire
          palette="custom"
          shades={["#5a1603", "#8f2404", "#c23e07", "#f0650d", "#ffa040", "#ffd98f"]}
          sparkColor="#ffd98f"
          intensity={85}
          windDirection="right"
          windForce={8}
          decay={16}
          turbulence={34}
          embers
          sparks
          charset="classic"
          backgroundColor="transparent"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* 中央文字提示 */}
      <div
        className="absolute inset-x-0 bottom-[24%] flex justify-center transition-opacity duration-500"
        style={{ opacity: shown ? 1 : 0 }}
      >
        <span className="font-heading text-sm tracking-[0.6em] text-[#f7f4ec]/85">
          盛 世 之 后
        </span>
      </div>
    </div>
  );
}

export function goWithTransition(opts: { mode?: TransitionMode; index?: number; target?: string }) {
  window.dispatchEvent(new CustomEvent("monumoir:tang-go", { detail: opts }));
}
