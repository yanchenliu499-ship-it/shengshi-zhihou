"use client";

import HoverImageReveal from "@/components/originkit/ui/hover-image-reveal";
import { BASE_PATH } from "@/lib/data";

const PERIODS = [
  { text: "肃宗—代宗 · 哀恸（哀悼盛世 · 忠节初现）", img: "/img/wordcloud_0.png" },
  { text: "德宗—宪宗 · 反思（天宝锚定 · 制度反思）", img: "/img/wordcloud_1.png" },
  { text: "穆宗—文宗 · 追忆（文化记忆 · 盛世想象）", img: "/img/wordcloud_2.png" },
  { text: "武宗—哀帝 · 宿命（历史典故化 · 盖棺定论）", img: "/img/wordcloud_3.png" },
];

/** 悬停查看各时期词云（Hover Image Reveal） */
export function PeriodHoverReveal() {
  return (
    <HoverImageReveal
      items={{
        itemCount: PERIODS.length,
        ...PERIODS.reduce<Record<string, unknown>>((acc, p, i) => {
          acc[`item${i + 1}`] = {
            text: p.text,
            image: { src: `${BASE_PATH}${p.img}`, alt: p.text },
          };
          return acc;
        }, {}),
      }}
      font={{
        fontFamily: '"Noto Serif SC", "Songti SC", serif',
        fontSize: 20,
        fontWeight: 600,
        letterSpacing: "0.02em",
        lineHeight: 1.7,
      }}
      textColor="#F7F5F1"
      dimColor="rgba(255,255,255,0.18)"
      align="left"
      rowGap={14}
      imageWidth={360}
      imageHeight={274}
      rounded={12}
      offsetX={190}
      offsetY={-30}
      followStrength={1}
      backgroundColor="#1C2330"
      style={{ borderRadius: 14, height: "100%", minHeight: 320 }}
    />
  );
}
