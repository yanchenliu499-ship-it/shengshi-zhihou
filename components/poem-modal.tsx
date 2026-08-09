"use client";

import { useEffect } from "react";
import type { PoemPoint } from "@/lib/data";

function sentimentClass(s: number) {
  return s >= 0 ? "bg-[rgba(191,133,103,0.12)] text-[#BF8567]" : "bg-[rgba(121,23,22,0.10)] text-[#791716]";
}

export function PoemModal({
  poem,
  onClose,
}: {
  poem: PoemPoint;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(53,71,95,0.50)] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative max-h-[82vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-card p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)] md:p-7">
        <button
          type="button"
          aria-label="关闭"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-black/5 hover:text-accent"
        >
          ✕
        </button>
        <div className="font-heading text-xl font-bold text-accent">{poem.author}</div>
        <div className="mt-1 text-[15px] text-ink">
          {poem.title}{" "}
          {poem.source && (
            <span className="text-xs text-ink-muted">（{poem.source}）</span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
          <span className="rounded bg-paper-deep px-2 py-0.5">{poem.period}</span>
          <span className={`rounded px-2 py-0.5 font-medium ${sentimentClass(poem.sentiment)}`}>
            情感 {poem.sentiment.toFixed(2)}
          </span>
          <span>{poem.word_count} 词</span>
        </div>
        <div className="mt-4 max-h-[200px] overflow-y-auto whitespace-pre-line rounded-xl bg-paper-deep p-4 font-body text-[14px] leading-[1.9] text-ink">
          {poem.text || "（正文截断）"}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded bg-[rgba(191,133,103,0.12)] px-2 py-1 font-medium text-[#BF8567]">
            正向词 {poem.positive_words}
          </span>
          <span className="rounded bg-[rgba(121,23,22,0.10)] px-2 py-1 font-medium text-[#791716]">
            负向词 {poem.negative_words}
          </span>
          <span className="rounded bg-[rgba(95,44,33,0.08)] px-2 py-1 font-medium text-[#5F2C21]">
            归因 {poem.blame_target || "其他"}
          </span>
        </div>
      </div>
    </div>
  );
}
