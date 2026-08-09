"use client";

import { useEffect, useState } from "react";
import { useDeck } from "@/components/deck";
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

/** 首屏「进入研究」按钮：点击触发宝相花转场进入下一屏 */
function EnterButton() {
  const { next } = useDeck();
  return (
    <button
      type="button"
      aria-label="进入研究"
      onClick={() => next("baoxiang")}
      className="group absolute inset-x-0 bottom-[96px] z-[12] mx-auto flex w-fit cursor-pointer flex-col items-center gap-1.5 border-0 bg-transparent p-2 transition-opacity duration-500 ease-out hover:opacity-90"
    >
      <span className="text-xs font-light tracking-[0.25em] text-white/75">进入研究</span>
      <ArrowDownIcon className="h-4 w-4 text-white/75 animate-bounce-soft transition-transform group-hover:translate-y-0.5" />
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
            "radial-gradient(ellipse at 22% 40%, rgba(139,26,26,0.16) 0%, transparent 55%), radial-gradient(ellipse at 78% 60%, rgba(184,134,11,0.10) 0%, transparent 55%)",
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
            <p className="font-heading text-xl font-medium text-[#c44d4d] sm:text-2xl md:text-3xl">
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
            中晚唐的皇帝制敕、大臣奏状与文人文集中，反复出现「兵兴以来」「天宝以来」的追忆——安史之乱作为重大转折被反复提及。
            <br className="hidden md:block" />
            但唐人自己如何认知这场变乱？本网站以《全唐诗》444 首安史之乱题材诗歌为量化语料，
            <br className="hidden md:block" />
            通过情感分析、LDA 主题建模与话语分析，追踪 762—907 年间唐人记忆与衰亡叙事的演变轨迹。
          </p>
        </ScrollReveal>

        <ScrollReveal delay={480} className="mt-12">
          <div className="flex items-start gap-7 sm:gap-10 md:gap-16">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-heading text-3xl font-black text-[#c44d4d] sm:text-4xl md:text-5xl">
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

      <EnterButton />
    </header>
  );
}
