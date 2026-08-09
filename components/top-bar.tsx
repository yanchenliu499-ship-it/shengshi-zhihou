"use client";

import { useState } from "react";
import { useDeck } from "@/components/deck";
import { MenuIcon, CloseIcon } from "@/components/icons";
import FlowingMenu from "@/components/flowing-menu/FlowingMenu";
import { BASE_PATH } from "@/lib/data";

const MENU_ITEMS = [
  { num: "01", label: "研究问题", index: 1, img: "/img/menu/menu-hero-tornado.png" },
  { num: "02", label: "情感分析", index: 2, img: "/img/menu/menu-sticker-cards.png" },
  { num: "03", label: "主题与话语", index: 3, img: "/img/menu/menu-flame-timeline.jpg" },
  { num: "04", label: "四阶段演变", index: 4, img: "/img/menu/menu-palace-zhongxing.png" },
  { num: "05", label: "未完成的中兴", index: 5, img: "/img/menu/menu-palace-section.png" },
  { num: "06", label: "从战争到宫闱", index: 6, img: "/img/menu/menu-question-plaque.jpg" },
  { num: "07", label: "文本探索器", index: 7, img: "/img/menu/menu-method.jpg" },
  { num: "08", label: "研究方法", index: 8, img: "/img/menu/menu-characters.png" },
  { num: "09", label: "结语", index: 9, img: "/img/menu/menu-characters.png" },
];

/**
 * 顶部顶栏：左侧「盛世之后」字标（点击回封面），右侧页码 + 菜单入口。
 */
export function TopBar() {
  const { index, total, goTo } = useDeck();
  const [open, setOpen] = useState(false);

  const go = (i: number, mode: "baoxiang" | "axe" | "ribbon") => {
    setOpen(false);
    goTo(i, mode);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-[#101010] text-white"
          role="dialog"
          aria-modal="true"
          aria-label="网站导航"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(139,26,26,0.18) 0%, transparent 55%)" }}
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-auto items-center justify-between px-5 py-4 md:px-8">
            <span className="text-xs tracking-wider text-white/40">盛世之后 · 观念流变</span>
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
                link: `#screen-${m.index}`,
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
              onNavigate={(item) => {
                const found = MENU_ITEMS.find((m) => `#screen-${m.index}` === item.link);
                go(found ? found.index : 0, "ribbon");
              }}
            />
          </div>
          <div className="relative z-10 flex items-center justify-center gap-6 pb-10 pt-4 text-xs text-white/40">
            <span>IDHFUS 2026 · 赛道一</span>
            <span>·</span>
            <span>中国人民大学信息资源管理学院</span>
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-3 md:px-8">
        <button
          type="button"
          onClick={() => go(0, "baoxiang")}
          className="font-heading text-xl font-light tracking-wide text-[#0E0E0E] transition-colors md:text-2xl"
        >
          盛世之后
        </button>
        <div className="flex items-center gap-3">
          <span className="font-body text-xs tabular-nums text-ink-soft">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </>
  );
}
