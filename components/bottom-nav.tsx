"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/components/lenis-provider";
import { ArrowUpIcon, CloseIcon, MenuIcon } from "@/components/icons";

const MENU_ITEMS = [
  { num: "01", label: "研究问题", href: "#about" },
  { num: "02", label: "数据分析", href: "#analysis" },
  { num: "03", label: "四阶段演变", href: "#timeline" },
  { num: "04", label: "未完成的中兴", href: "#zhongxing" },
  { num: "05", label: "从战争到宫闱", href: "#palace" },
  { num: "06", label: "文本探索器", href: "#texts" },
  { num: "07", label: "研究方法", href: "#method" },
  { num: "08", label: "团队", href: "#team" },
];

export function BottomNav() {
  const { scrollTo } = useLenis();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // 时间轴（03）为深色区，滚动接近时底部导航切换为深色样式
      const timeline = document.getElementById("timeline");
      const top = timeline?.offsetTop ?? Infinity;
      setDark(window.scrollY > top - window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    const target = document.querySelector(href);
    if (target) scrollTo(target as HTMLElement, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const barStyle = open
    ? "bg-[#1C2330]"
    : dark
      ? "bg-[#1C2330]/85 text-white"
      : "bg-[#FDFCFA]/80 text-ink";
  const wordmark = open ? "text-white" : dark ? "text-white" : "text-ink";

  return (
    <>
      {/* 全屏菜单遮罩 */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col bg-[#1C2330] text-white"
          role="dialog"
          aria-modal="true"
          aria-label="网站导航"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at 80% 20%, rgba(121,23,22,0.14) 0%, transparent 55%)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-auto items-center justify-between px-5 py-4 md:px-8">
            <span className="text-xs tracking-wider text-white/40">
              盛世之后 · 观念流变
            </span>
            <span className="font-heading text-lg text-white/70">Monumoir × 安史之乱</span>
            <button
              type="button"
              aria-label="关闭菜单"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 p-6 md:gap-10">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item.href)}
                className="group flex items-baseline gap-4"
              >
                <span className="text-xs tracking-[0.3em] text-[#BF8567]">{item.num}</span>
                <span className="font-heading text-3xl font-bold text-white transition-transform duration-300 group-hover:rotate-[2deg] md:text-5xl">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
          <div className="relative z-10 flex items-center justify-center gap-6 pb-10 text-xs text-white/40">
            <span>IDHFUS 2026 · 赛道一</span>
            <span>·</span>
            <span>中国人民大学信息资源管理学院</span>
          </div>
        </div>
      )}

      {/* 底部导航栏（Monumoir 三列玻璃拟态） */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 isolate grid grid-cols-3 items-center border-t py-1.5 px-5 backdrop-blur-xl transition-colors duration-[800ms] ease-out md:py-3 ${barStyle} ${
          open ? "border-white/10" : "border-line/60"
        }`}
      >
        <button
          type="button"
          aria-label="回到顶部"
          onClick={() => go("#about")}
          className={`relative z-10 flex w-fit items-center justify-center justify-self-start rounded-full p-2 transition-colors ${
            open || dark ? "text-white/70 hover:bg-white/10" : "text-ink-soft hover:bg-black/5"
          }`}
        >
          <ArrowUpIcon className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <span
          className={`relative z-10 justify-self-center font-heading text-2xl font-light tracking-wide md:text-3xl ${wordmark}`}
        >
          盛世之后
        </span>
        <button
          type="button"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          onClick={() => setOpen((v) => !v)}
          className={`relative z-10 flex w-fit items-center justify-center justify-self-end rounded-full p-2 transition-colors ${
            open || dark ? "text-white hover:bg-white/10" : "text-ink hover:bg-black/5"
          }`}
        >
          {open ? <CloseIcon className="h-5 w-5 md:h-6 md:w-6" /> : <MenuIcon className="h-5 w-5 md:h-6 md:w-6" />}
        </button>
      </div>
    </>
  );
}
