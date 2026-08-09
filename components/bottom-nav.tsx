"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/components/lenis-provider";
import { goWithTransition } from "@/components/tang-transition";
import { ArrowUpIcon, CloseIcon, MenuIcon } from "@/components/icons";
import FlowingMenu from "@/components/flowing-menu/FlowingMenu";
import { BASE_PATH } from "@/lib/data";

const MENU_ITEMS = [
  { num: "01", label: "研究问题", href: "#about", img: "/img/menu/menu-hero-tornado.png" },
  { num: "02", label: "数据分析", href: "#analysis", img: "/img/menu/menu-sticker-cards.png" },
  { num: "03", label: "四阶段演变", href: "#timeline", img: "/img/menu/menu-flame-timeline.jpg" },
  { num: "04", label: "未完成的中兴", href: "#zhongxing", img: "/img/menu/menu-palace-zhongxing.png" },
  { num: "05", label: "从战争到宫闱", href: "#palace", img: "/img/menu/menu-palace-section.png" },
  { num: "06", label: "文本探索器", href: "#texts", img: "/img/menu/menu-question-plaque.jpg" },
  { num: "07", label: "研究方法", href: "#method", img: "/img/menu/menu-method.jpg" },
  { num: "08", label: "团队", href: "#team", img: "/img/menu/menu-characters.png" },
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
    // 点击转场：播放唐代纹样转场动画，覆盖期间完成滚动
    goWithTransition(href);
  };

  const barStyle = open
    ? "bg-[#101010]"
    : dark
      ? "bg-[#101010]/85 text-white"
      : "bg-paper/80 text-ink";
  const wordmark = open ? "text-white" : dark ? "text-white" : "text-ink";

  return (
    <>
      {/* 全屏目录（FlowingMenu 动效） */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col bg-[#101010] text-white"
          role="dialog"
          aria-modal="true"
          aria-label="网站导航"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at 80% 20%, rgba(139,26,26,0.18) 0%, transparent 55%)",
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

          <div className="relative z-10 min-h-0 flex-1">
            <FlowingMenu
              items={MENU_ITEMS.map((m) => ({
                link: m.href,
                text: m.label,
                image: `${BASE_PATH}${m.img}`,
                hint: m.num,
              }))}
              speed={14}
              textColor="#f7f4ec"
              bgColor="transparent"
              marqueeBgColor="#faf7f2"
              marqueeTextColor="#2c2416"
              borderColor="rgba(255,255,255,0.12)"
              onNavigate={(item) => go(item.link)}
            />
          </div>

          <div className="relative z-10 flex items-center justify-center gap-6 pb-10 pt-4 text-xs text-white/40">
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
