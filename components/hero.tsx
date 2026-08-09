"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/components/lenis-provider";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ArrowDownIcon } from "@/components/icons";
import { BrushTitle } from "@/components/originkit/brush-title";
import { TornadoBackdrop } from "@/components/originkit/tornado-backdrop";
import { CloudScroll, MountainScene, SealStamp } from "@/components/ornaments";

const HERO_STATS = [
  { number: "444", label: "全唐诗文本" },
  { number: "4", label: "时期切片" },
  { number: "20", label: "LDA 主题" },
  { number: "171", label: "情感词" },
];

/** 固定于首屏下方的「向下探索」按钮 */
function ScrollHintButton() {
  const { scrollTo } = useLenis();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="向下探索"
      onClick={() => scrollTo(window.innerHeight, { duration: 1.6 })}
      className="fixed inset-x-0 bottom-[84px] z-[12] mx-auto flex w-fit cursor-pointer flex-col items-center gap-1 border-0 bg-transparent p-2 transition-opacity duration-500 ease-out hover:opacity-80 lg:bottom-[120px]"
      style={{ opacity: hidden ? 0 : 1, pointerEvents: hidden ? "none" : "auto" }}
    >
      <span className="text-xs font-light tracking-[0.2em] text-white/70">向下探索</span>
      <ArrowDownIcon className="h-4 w-4 text-white/70 animate-bounce-soft" />
    </button>
  );
}

export function Hero() {
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const onScroll = () => setParallax(Math.min(window.scrollY * 0.22, 140));
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-night px-4 pb-24 pt-20 text-center">
      {/* 粒子龙卷氛围背景（金色 + 朱砂红，网站配色） */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-70" aria-hidden="true">
        <TornadoBackdrop />
      </div>

      {/* 深色渐变 + 宣纸纹理 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 22% 40%, rgba(121,23,22,0.12) 0%, transparent 55%), radial-gradient(ellipse at 78% 60%, rgba(191,133,103,0.08) 0%, transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      {/* 水墨山峦剪影（底部，滚动视差） */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 will-change-transform"
        style={{ transform: `translateY(${parallax}px)` }}
        aria-hidden="true"
      >
        <MountainScene className="h-[200px] w-full md:h-[280px]" />
      </div>

      {/* 祥云纹（角落点缀） */}
      <div className="pointer-events-none absolute left-[5%] top-[16%] z-0 text-white/15 md:left-[10%]" aria-hidden="true">
        <CloudScroll className="h-10 w-20 md:h-14 md:w-28" />
      </div>
      <div className="pointer-events-none absolute right-[6%] top-[12%] z-0 rotate-12 text-white/10" aria-hidden="true">
        <CloudScroll className="h-8 w-16 md:h-12 md:w-24" />
      </div>

      <div className="relative z-10 flex w-full max-w-[1000px] flex-col items-center">
        <ScrollReveal>
          <span className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-[0.25em] text-[#AA967E]">
            唐代文献 · 数字人文研究
          </span>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div
            role="heading"
            aria-level={1}
            aria-label="盛世之后"
            className="mt-8 flex w-full justify-center"
          >
            <BrushTitle text="盛世之后" dark size="hero" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <div className="mt-4 flex items-center justify-center gap-3">
            <p className="font-heading text-xl font-medium text-[#BF8567] sm:text-2xl md:text-3xl">
              唐人视野中的王朝衰亡
            </p>
            <SealStamp
              text="安史"
              className="h-9 w-9 shrink-0 rotate-6 opacity-90 md:h-11 md:w-11"
              tone="accent"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={360}>
          <p className="mt-8 max-w-[680px] text-[15px] font-light leading-[1.9] text-white/65 md:text-base">
            安史之乱（755—763）是唐代由盛转衰的转折点——这是后人的共识。
            <br className="hidden md:block" />
            但唐人自己呢？从杜甫的「国破山河在」到韩愈的「天宝以后」再到《旧唐书》的盖棺定论，
            <br className="hidden md:block" />
            唐人何时、如何建构起「王朝已衰」的集体认知？本项目通过数字人文方法，追踪 762—907
            年间唐代文献中安史之乱记忆与衰亡叙事的演变轨迹。
          </p>
        </ScrollReveal>

        <ScrollReveal delay={480} className="mt-12">
          <div className="flex items-start gap-7 sm:gap-10 md:gap-16">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-heading text-3xl font-black text-[#BF8567] sm:text-4xl md:text-5xl">
                  {s.number}
                </div>
                <div className="mt-1 text-[11px] font-light tracking-wider text-white/50 md:text-xs">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <ScrollHintButton />
    </header>
  );
}
