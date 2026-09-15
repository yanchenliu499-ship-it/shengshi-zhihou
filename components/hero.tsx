"use client";

import { useDeck } from "@/components/deck";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ArrowDownIcon } from "@/components/icons";
import { BrushTitle } from "@/components/originkit/brush-title";
import { SealStamp } from "@/components/ornaments";
import { PaperTheater } from "@/components/paper-theater";

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
      className="group absolute inset-x-0 bottom-[96px] z-[12] mx-auto flex w-fit cursor-pointer flex-col items-center gap-1.5 border-0 bg-transparent p-2 transition-opacity duration-500 ease-out hover:opacity-80"
    >
      <span className="text-xs font-light tracking-[0.25em] text-ink-soft">进入研究</span>
      <ArrowDownIcon className="h-4 w-4 text-ink-soft animate-bounce-soft transition-transform group-hover:translate-y-0.5" />
    </button>
  );
}

export function Hero() {
  return (
    <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-paper px-4 pb-24 pt-20 text-center">
      {/* 纸剧场：九件唐代元件的交互纵深场景（浅色宣纸封面） */}
      <div className="absolute inset-0 z-0">
        <PaperTheater />
      </div>

      <div className="pointer-events-none relative z-10 flex w-full max-w-[1000px] flex-col items-center">
        <ScrollReveal delay={120}>
          <div
            role="heading"
            aria-level={1}
            aria-label="盛世之后"
            className="mt-8 flex w-full justify-center"
          >
            <BrushTitle text="盛世之后" dark={false} size="hero" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <div className="mt-4 flex items-center justify-center gap-3">
            <p className="font-heading text-xl font-medium text-accent sm:text-2xl md:text-3xl">
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
          <p className="mt-8 max-w-[680px] text-[15px] font-light leading-[1.9] text-ink-soft md:text-base">
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
                <div className="font-heading text-3xl font-black text-accent sm:text-4xl md:text-5xl">
                  {s.number}
                </div>
                <div className="mt-1 text-[11px] font-light tracking-wider text-ink-muted md:text-xs">
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
