"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { fetchJson, PERIOD_COLORS, type TimelinePeriod } from "@/lib/data";

export function Timeline() {
  const [data, setData] = useState<TimelinePeriod[] | null>(null);
  useEffect(() => {
    fetchJson<TimelinePeriod[]>("/data/timeline.json").then(setData).catch(console.error);
  }, []);

  return (
    <div className="relative mx-auto max-w-[880px] px-2">
      {/* 纵向主线 */}
      <div
        className="absolute left-1/2 top-0 bottom-0 hidden w-[2px] -translate-x-1/2 md:block"
        style={{
          background: "linear-gradient(to bottom, #791716, #BF8567, #5F2C21)",
        }}
        aria-hidden="true"
      />
      <div className="space-y-10 md:space-y-16">
        {(data ?? []).map((period, i) => {
          const left = i % 2 === 0;
          return (
            <ScrollReveal key={period.id} delay={i * 80}>
              <div className="relative md:grid md:grid-cols-2 md:gap-12">
                {/* 圆点 */}
                <div
                  className="absolute left-4 top-2 z-10 hidden h-4 w-4 rounded-full border-2 border-[#1C2330] md:block"
                  style={{
                    background: PERIOD_COLORS[i],
                    left: "calc(50% - 8px)",
                    boxShadow: `0 0 0 4px rgba(121,23,22,0.12)`,
                  }}
                  aria-hidden="true"
                />
                <div className={left ? "md:col-start-1 md:pr-4 md:text-right" : "md:col-start-2 md:pl-4"}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.07] md:p-7">
                    <div className="flex items-center gap-3 md:justify-between">
                      <span
                        className="inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wider"
                        style={{ background: `${PERIOD_COLORS[i]}22`, color: PERIOD_COLORS[i] }}
                      >
                        {period.years}
                      </span>
                      <span className="text-xs text-white/40">情感均值 {period.sentimentAvg.toFixed(2)}</span>
                    </div>
                    <h3 className="mt-4 font-heading text-2xl font-bold text-white md:text-[28px]">
                      {period.label}
                    </h3>
                    <p className="mt-3 text-sm font-light leading-[1.9] text-white/60">
                      {period.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {period.dominantThemes.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    {period.keyFigures && period.keyFigures.length > 0 && (
                      <div className="mt-4 text-xs text-white/40">
                        <span className="mr-2 text-white/30">代表诗人</span>
                        {period.keyFigures.join(" · ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
