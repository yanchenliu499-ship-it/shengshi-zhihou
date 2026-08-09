"use client";

import { useDeck } from "@/components/deck";
import { ArrowUpIcon, ArrowDownIcon } from "@/components/icons";

/**
 * 底部导航：上一屏 / 页码 / 下一屏（清晰图标跳转）。
 * 「盛世之后」字标与全屏菜单已移至顶部顶栏（TopBar）。
 */
export function BottomNav() {
  const { index, total, next, prev } = useDeck();
  // 深色屏：四阶段演变(4)、结语(9)
  const dark = index === 4 || index === 9;
  const accent = dark ? "text-white/70 hover:bg-white/10" : "text-ink-soft hover:bg-black/5";
  const page = dark ? "text-white/60" : "text-ink-soft";

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 isolate grid grid-cols-3 items-center border-t py-1.5 px-5 backdrop-blur-xl transition-colors duration-[800ms] ease-out md:py-2.5 ${
        dark ? "border-white/10 bg-[#101010]/85 text-white" : "border-line/60 bg-paper/80 text-ink"
      }`}
    >
      <button
        type="button"
        aria-label="上一屏"
        onClick={() => prev("axe")}
        className={`group relative z-10 flex w-fit items-center gap-1.5 justify-self-start rounded-full p-2 transition-colors ${accent}`}
      >
        <ArrowUpIcon className="h-4 w-4 md:h-5 md:w-5" />
        <span className="hidden text-xs sm:inline">上一屏</span>
      </button>

      <span className={`relative z-10 justify-self-center font-body text-xs tabular-nums tracking-wider ${page}`}>
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>

      <button
        type="button"
        aria-label="下一屏"
        onClick={() => next("baoxiang")}
        className={`group relative z-10 flex w-fit items-center gap-1.5 justify-self-end rounded-full p-2 transition-colors ${accent}`}
      >
        <span className="hidden text-xs sm:inline">下一屏</span>
        <ArrowDownIcon className="h-4 w-4 md:h-5 md:w-5" />
      </button>
    </div>
  );
}
