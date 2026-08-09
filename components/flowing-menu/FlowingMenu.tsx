"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { gsap } from "gsap";
import "./flowing-menu.css";

export interface FlowingMenuItem {
  link: string;
  text: string;
  image: string;
  /** 可选的序号 / 副标签，例如 "01" */
  hint?: string;
}

interface FlowingMenuProps {
  items?: FlowingMenuItem[];
  /** marquee 跑马灯单圈时长（秒），越小越快 */
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  className?: string;
  /** 点击菜单项时触发（用于 Lenis 平滑滚动） */
  onNavigate?: (item: FlowingMenuItem) => void;
}

const ANIMATION_DEFAULTS = { duration: 0.6, ease: "expo" } as const;

function distMetric(x: number, y: number, x2: number, y2: number) {
  const xDiff = x - x2;
  const yDiff = y - y2;
  return xDiff * xDiff + yDiff * yDiff;
}

function findClosestEdge(
  mouseX: number,
  mouseY: number,
  width: number,
  height: number
): "top" | "bottom" {
  const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
  const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
  return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
}

export default function FlowingMenu({
  items = [],
  speed = 15,
  textColor = "#fff",
  bgColor = "#120F17",
  marqueeBgColor = "#fff",
  marqueeTextColor = "#120F17",
  borderColor = "#fff",
  className = "",
  onNavigate,
}: FlowingMenuProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  /* 菜单项入场：逐行上浮淡入，让目录打开更顺滑 */
  useEffect(() => {
    const rows = wrapRef.current?.querySelectorAll<HTMLElement>(".fm-menu__item");
    if (!rows || rows.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { y: 56, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.055 }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, [items]);

  return (
    <div ref={wrapRef} className={`fm-menu-wrap ${className}`} style={{ backgroundColor: bgColor }}>
      <nav className="fm-menu" aria-label="网站目录">
        {items.map((item, idx) => (
          <MenuItem
            key={`${item.link}-${idx}`}
            item={item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({
  item,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  onNavigate,
}: {
  item: FlowingMenuItem;
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  onNavigate?: (item: FlowingMenuItem) => void;
}) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const marqueeInnerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  const { text, image } = item;

  useEffect(() => {
    const calculateRepetitions = () => {
      const marqueeContent =
        marqueeInnerRef.current?.querySelector<HTMLElement>(".fm-marquee__part");
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      if (contentWidth <= 0) return;

      // 需要铺满视口 + 额外几份以保证无缝循环
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const setupMarquee = () => {
      const marqueeContent =
        marqueeInnerRef.current?.querySelector<HTMLElement>(".fm-marquee__part");
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      animationRef.current?.kill();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // 平移恰好一个内容宽度，形成无缝循环
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    };

    // 等待 repetitions 更新后 DOM 就绪
    const timer = window.setTimeout(setupMarquee, 50);
    return () => {
      window.clearTimeout(timer);
      animationRef.current?.kill();
    };
  }, [text, image, repetitions, speed]);

  const enterFrom = (clientX: number, clientY: number) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(clientX - rect.left, clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: ANIMATION_DEFAULTS })
      .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" }, 0);
  };

  const leaveTo = (clientX: number, clientY: number) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(clientX - rect.left, clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: ANIMATION_DEFAULTS })
      .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0);
  };

  const handleMouseEnter = (ev: ReactMouseEvent<HTMLAnchorElement>) => {
    enterFrom(ev.clientX, ev.clientY);
  };

  const handleMouseLeave = (ev: ReactMouseEvent<HTMLAnchorElement>) => {
    leaveTo(ev.clientX, ev.clientY);
  };

  const handleFocus = () => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    enterFrom(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const handleBlur = () => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    leaveTo(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  return (
    <div className="fm-menu__item" ref={itemRef} style={{ borderColor }}>
      <a
        className="fm-menu__item-link"
        href={item.link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={(ev) => {
          if (onNavigate) {
            ev.preventDefault();
            onNavigate(item);
          }
        }}
        style={{ color: textColor }}
      >
        {item.hint && <span className="fm-menu__item-hint">{item.hint}</span>}
        {text}
      </a>
      <div
        className="fm-marquee"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
        aria-hidden="true"
      >
        <div className="fm-marquee__inner-wrap">
          <div className="fm-marquee__inner" ref={marqueeInnerRef}>
            {[...Array(repetitions)].map((_, idx) => (
              <div className="fm-marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                <span>{text}</span>
                <div
                  className="fm-marquee__img"
                  style={{ backgroundImage: `url(${image})` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
