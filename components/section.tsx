import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { BrushTitle } from "@/components/originkit/brush-title";
import { DividerOrnament, FrettMark } from "@/components/ornaments";
import { FlameTransition } from "@/components/flame-transition";

export function SectionHeader({
  num,
  title,
  subtitle,
  dark = false,
}: {
  num: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <ScrollReveal className="text-center mb-12 md:mb-16">
      <span
        className={`mb-2 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] ${
          dark ? "text-[#c44d4d]" : "text-accent"
        }`}
      >
        <FrettMark className={`h-5 w-5 ${dark ? "text-[#b8860b]/70" : "text-accent/60"}`} />
        {num}
        <FrettMark className={`h-5 w-5 rotate-180 ${dark ? "text-[#b8860b]/70" : "text-accent/60"}`} />
      </span>
      <div
        role="heading"
        aria-level={2}
        aria-label={title}
        className={`flex w-full justify-center font-heading text-3xl font-bold tracking-wide md:text-5xl ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        <BrushTitle text={title} dark={dark} />
      </div>
      <DividerOrnament
        className={`mx-auto mt-4 mb-5 h-4 w-52 max-w-full ${dark ? "" : ""}`}
        dark={dark}
      />
      {subtitle && (
        <p
          className={`mx-auto max-w-[560px] text-[15px] leading-relaxed ${
            dark ? "text-white/60" : "text-ink-soft"
          }`}
        >
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}

export function Section({
  id,
  children,
  className = "",
  dark = false,
  topGradient,
  flame,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
  /** 顶部渐变过渡（消除与上一区块的硬明暗分界） */
  topGradient?: string;
  /** 顶部 ASCII 火焰过渡动效（烽火意象） */
  flame?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative ${dark ? "text-white" : "bg-paper text-ink"} ${className}`}
      style={
        dark
          ? {
              background:
                "radial-gradient(ellipse at 50% -10%, rgba(139,26,26,0.42) 0%, rgba(40,8,8,0.25) 45%, #0f0505 75%, #101010 100%), #101010",
            }
          : undefined
      }
    >
      {dark && (
        <div
          className="reticent-pattern pointer-events-none absolute inset-0 opacity-[0.07]"
          aria-hidden="true"
        />
      )}
      {topGradient && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 md:h-40"
          style={{ background: topGradient }}
          aria-hidden="true"
        />
      )}
      {flame && <FlameTransition tone={dark ? "dark" : "light"} />}
      <div className="relative z-10 mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-28">
        {children}
      </div>
    </section>
  );
}
