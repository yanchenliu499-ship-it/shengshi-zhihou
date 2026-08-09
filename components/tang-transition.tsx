"use client";

import { useCallback, useEffect, useState } from "react";
import { useLenis } from "@/components/lenis-provider";
import {
  BaoxiangFlower,
  DaggerAxe,
  DunhuangRibbon,
} from "@/components/ornaments";
import AsciiFire from "@/components/originkit/ui/ascii-flame";

type Phase = "idle" | "opening" | "switching" | "closing";

const OPEN_MS = 880;
const SWITCH_HOLD_MS = 1000;
const CLOSE_MS = 560;

/**
 * 唐代风格点击转场：宝相花纹旋转展开 + 敦煌飘带 + 兵戈 + 火焰。
 * 监听 window 上的 monumoir:tang-go 事件（detail.target = CSS 选择器），
 * 覆盖期间完成滚动，实现「点击 → 转场 → 新章节」而非直接滑动。
 */
export function TangTransition() {
  const { scrollTo } = useLenis();
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    const onGo = (e: Event) => {
      const detail = (e as CustomEvent<{ target?: string }>).detail;
      if (!detail?.target) return;
      setTarget(detail.target);
      setPhase("opening");
    };
    window.addEventListener("monumoir:tang-go", onGo);
    return () => window.removeEventListener("monumoir:tang-go", onGo);
  }, []);

  const active = phase !== "idle";

  useEffect(() => {
    if (phase === "opening") {
      const t = window.setTimeout(() => setPhase("switching"), OPEN_MS);
      return () => window.clearTimeout(t);
    }
    if (phase === "switching") {
      const t = window.setTimeout(() => {
        // 遮罩覆盖期间执行滚动（用户看不到滑动过程，只看到转场）
        const el = target ? document.querySelector(target) : null;
        if (el) scrollTo(el as HTMLElement, { duration: 1.1, force: true });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        setPhase("closing");
      }, SWITCH_HOLD_MS);
      return () => window.clearTimeout(t);
    }
    if (phase === "closing") {
      const t = window.setTimeout(() => {
        setPhase("idle");
        setTarget(null);
      }, CLOSE_MS);
      return () => window.clearTimeout(t);
    }
  }, [phase, target, scrollTo]);

  if (!active) return null;

  const expanding = phase === "opening";
  const hiding = phase === "closing";

  return (
    <div
      className="fixed inset-0 z-[200]"
      aria-hidden="true"
      style={{ pointerEvents: phase === "switching" ? "auto" : "none" }}
    >
      {/* 深色遮罩 */}
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
            "radial-gradient(ellipse at 50% 45%, rgba(139,26,26,0.28) 0%, transparent 60%)",
        }}
      />

      {/* 宝相花纹：旋转展开 / 收起 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: hiding
              ? "scale(0) rotate(0deg)"
              : expanding
                ? "scale(0.15) rotate(-90deg) translateY(20px)"
                : "scale(1) rotate(180deg)",
            opacity: hiding ? 0 : expanding ? 0 : 1,
          }}
        >
          <BaoxiangFlower className="h-[78vmin] w-[78vmin] text-[#b8860b]/90 drop-shadow-[0_0_40px_rgba(184,134,11,0.35)]" />
        </div>
      </div>

      {/* 敦煌飘带（顶部 / 底部） */}
      <div
        className="absolute inset-x-0 top-[12%] flex justify-center transition-opacity duration-700"
        style={{ opacity: hiding ? 0 : 1 }}
      >
        <DunhuangRibbon className="h-8 w-56 text-[#c4a86b]/70 md:w-96" />
      </div>
      <div
        className="absolute inset-x-0 bottom-[14%] flex justify-center rotate-180 transition-opacity duration-700"
        style={{ opacity: hiding ? 0 : 1 }}
      >
        <DunhuangRibbon className="h-8 w-56 text-[#c4a86b]/60 md:w-96" />
      </div>

      {/* 兵戈（两侧交叉） */}
      <div
        className="absolute left-[6%] top-1/2 -translate-y-1/2 -rotate-12 transition-opacity duration-700"
        style={{ opacity: hiding ? 0 : 0.8 }}
      >
        <DaggerAxe className="h-16 w-16 text-[#8b1a1a] md:h-20 md:w-20" />
      </div>
      <div
        className="absolute right-[6%] top-1/2 -translate-y-1/2 rotate-12 scale-x-[-1] transition-opacity duration-700"
        style={{ opacity: hiding ? 0 : 0.8 }}
      >
        <DaggerAxe className="h-16 w-16 text-[#8b1a1a] md:h-20 md:w-20" />
      </div>

      {/* 火焰（底部） */}
      <div className="absolute inset-x-0 bottom-0 h-44 opacity-80">
        <AsciiFire
          palette="custom"
          shades={["#5a1603", "#8f2404", "#c23e07", "#f0650d", "#ffa040", "#ffd98f"]}
          sparkColor="#ffd98f"
          intensity={90}
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

      {/* 转场文字（中央章节提示由触发方提供，此处为金色小字装饰） */}
      <div
        className="absolute inset-x-0 bottom-[26%] flex justify-center transition-opacity duration-500"
        style={{ opacity: hiding || expanding ? 0 : 1 }}
      >
        <span className="font-heading text-sm tracking-[0.6em] text-[#f7f4ec]/80">
          盛 世 之 后
        </span>
      </div>
    </div>
  );
}

export function goWithTransition(target: string) {
  window.dispatchEvent(
    new CustomEvent("monumoir:tang-go", { detail: { target } })
  );
}
