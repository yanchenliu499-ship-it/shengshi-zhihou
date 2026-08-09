"use client";

import { useEffect, useState } from "react";
import { BASE_PATH } from "@/lib/data";

type Painting = {
  src: string;
  title: string;
  desc: string;
};

const PAINTINGS: Painting[] = [
  { src: "/img/tang/paintings/painting-1.jpg", title: "古画 · 壹", desc: "传世唐代绢本绘画 · 高清扫描（题名待补）" },
  { src: "/img/tang/paintings/painting-2.jpg", title: "古画 · 贰", desc: "传世唐代绢本绘画 · 高清扫描（题名待补）" },
  { src: "/img/tang/paintings/painting-3.jpg", title: "古画 · 叁", desc: "传世唐代绢本绘画 · 高清扫描（题名待补）" },
  { src: "/img/tang/paintings/painting-4.jpg", title: "古画 · 肆", desc: "传世唐代绢本绘画 · 高清扫描（题名待补）" },
  { src: "/img/tang/paintings/painting-5.jpg", title: "古画 · 伍", desc: "传世唐代绢本绘画 · 高清扫描（题名待补）" },
  { src: "/img/tang/paintings/painting-6.jpg", title: "古画 · 陆", desc: "传世唐代绢本绘画 · 高清扫描（题名待补）" },
  { src: "/img/tang/paintings/painting-7.jpg", title: "古画 · 柒", desc: "传世唐代绢本绘画 · 高清扫描（题名待补）" },
];

const PETALS = [
  { left: "12%", delay: "0s", dur: "9s", size: 8 },
  { left: "28%", delay: "2.4s", dur: "11s", size: 6 },
  { left: "47%", delay: "1.2s", dur: "10s", size: 9 },
  { left: "66%", delay: "3.1s", dur: "12s", size: 7 },
  { left: "82%", delay: "0.8s", dur: "9.5s", size: 6 },
  { left: "92%", delay: "2.0s", dur: "11.5s", size: 8 },
];

/** 09 唐代绘画 · 古画画廊（封面微动 · 点击展开） */
export function TangGallery() {
  const [selected, setSelected] = useState<Painting | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {PAINTINGS.map((p) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setSelected(p)}
            className="group relative cursor-pointer overflow-hidden rounded-lg border border-[rgba(170,150,126,0.35)] bg-[#101010] text-left shadow-[0_6px_20px_rgba(44,36,22,0.18)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(121,23,22,0.25)]"
          >
            {/* 封面：Ken Burns 缓慢游走 */}
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <img
                src={`${BASE_PATH}${p.src}`}
                alt={p.title}
                loading="lazy"
                className="kenburns h-full w-full object-cover"
              />
              {/* 光晕浮动 */}
              <div className="shimmer pointer-events-none absolute inset-0 mix-blend-screen" aria-hidden="true" />
              {/* 底部渐变压暗 */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
                <span className="font-heading text-sm font-bold text-[#FDFCFA] drop-shadow">{p.title}</span>
                <span className="text-[10px] tracking-widest text-white/70 opacity-0 transition-opacity group-hover:opacity-100">查看 ↦</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-ink-muted">
        点击封面展开画作 · 画中花鸟人物随光影缓缓浮动
      </p>

      {/* 详情弹窗 */}
      {selected && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(16,16,16,0.88)] p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          {/* 花瓣飘落 */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {PETALS.map((pt, i) => (
              <span
                key={i}
                className="petal absolute top-[-3%]"
                style={{
                  left: pt.left,
                  width: pt.size,
                  height: pt.size * 1.35,
                  animationDelay: pt.delay,
                  animationDuration: pt.dur,
                }}
              />
            ))}
          </div>

          <div className="relative flex max-h-[92vh] w-full max-w-[560px] flex-col items-center gap-4 overflow-y-auto rounded-xl border border-[rgba(170,150,126,0.35)] bg-[#161310] p-5 md:p-6">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition-colors hover:bg-white/20"
              aria-label="关闭"
              title="关闭（Esc）"
            >
              ✕
            </button>
            {/* 画作：Ken Burns 缓慢游走 */}
            <div className="relative w-full overflow-hidden rounded-md">
              <img
                src={`${BASE_PATH}${selected.src}`}
                alt={selected.title}
                className="kenburns-slow max-h-[68vh] w-full object-contain"
              />
              <div className="shimmer pointer-events-none absolute inset-0 mix-blend-screen" aria-hidden="true" />
            </div>
            {/* 内容卡 */}
            <div className="w-full rounded-md border border-[rgba(170,150,126,0.25)] bg-[#FDFCFA] p-4 text-center">
              <div className="font-heading text-lg font-bold text-[#791716]">{selected.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-[#5F2C21]">{selected.desc}</p>
              <p className="mt-2 text-[11px] text-[#AA967E]">画作题名与内容介绍待补充</p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mt-3 cursor-pointer rounded-full border border-[#791716]/30 px-5 py-1.5 text-xs font-medium text-[#791716] transition-colors hover:bg-[#791716]/10"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes kenburns {
          0%   { transform: scale(1.04) translate(0, 0); }
          50%  { transform: scale(1.16) translate(-1.5%, 1%); }
          100% { transform: scale(1.04) translate(1.5%, -1%); }
        }
        .kenburns { animation: kenburns 22s ease-in-out infinite alternate; }
        .kenburns-slow { animation: kenburns 32s ease-in-out infinite alternate; }

        @keyframes shimmer {
          0%   { transform: translateX(-30%) translateY(0) rotate(-8deg); opacity: 0.18; }
          50%  { opacity: 0.4; }
          100% { transform: translateX(30%) translateY(-4%) rotate(-8deg); opacity: 0.18; }
        }
        .shimmer {
          background: linear-gradient(115deg, transparent 30%, rgba(255, 236, 200, 0.5) 50%, transparent 70%);
          background-size: 220% 220%;
          animation: shimmer 7s ease-in-out infinite;
        }

        @keyframes petalFall {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.7; }
          100% { transform: translateY(105vh) translateX(40px) rotate(300deg); opacity: 0; }
        }
        .petal {
          border-radius: 60% 40% 55% 45%;
          background: radial-gradient(circle at 30% 30%, #e9b8a0, #c98a72 70%);
          animation: petalFall linear infinite;
        }
      `}</style>
    </>
  );
}
