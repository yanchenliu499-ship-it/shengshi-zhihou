"use client";

/**
 * 屏 7 · 文本探索器引导卡：提示全局右侧书签入口，并提供一键打开。
 */
export function TextExplorerGuide() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="max-w-[540px] text-[15px] leading-[2] text-ink-soft">
        文本探索器已移至<b className="text-[#791716]">右侧绛红书签</b>——
        点击页面右侧的书签标签，即可从任意一屏打开面板，按时期、态度筛选或自由检索唐代文献片段。
      </p>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("text-explorer:open"))}
        className="rounded-full border border-[#791716]/30 bg-[#791716]/5 px-6 py-2.5 text-sm font-medium text-[#791716] transition-colors hover:bg-[#791716]/10"
      >
        打开文本探索器
      </button>
    </div>
  );
}
