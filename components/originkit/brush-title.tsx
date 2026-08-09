"use client";

import PaintText from "@/components/originkit/ui/brush-reveal";

/**
 * BrushTitle —— 站点文字标题的"刷显"动效包装
 * 文字以弱色"幽灵"状态呈现，鼠标/手指刷过后被涂上主题色（绛红/赭石），
 * 数秒后自动复位，可反复刷涂。
 */
export function BrushTitle({
  text,
  dark = false,
  size = "section",
}: {
  text: string;
  dark?: boolean;
  size?: "section" | "hero";
}) {
  const paintColor = dark ? "#BF8567" : "#791716";
  const ghostColor = dark ? "rgba(255,255,255,0.45)" : "rgba(53,71,95,0.50)";
  const fontSize =
    size === "hero" ? "clamp(44px, 8vw, 96px)" : "clamp(30px, 4.5vw, 48px)";
  const fontWeight = size === "hero" ? 900 : 700;

  return (
    <PaintText
      text={text}
      font={{
        fontFamily: '"Noto Serif SC", "Songti SC", "SimSun", serif',
        fontSize,
        fontWeight,
        letterSpacing: size === "hero" ? "0.04em" : "0.02em",
        lineHeight: size === "hero" ? 1.15 : 1.3,
        textAlign: "center",
      }}
      paintColor={paintColor}
      ghostColor={ghostColor}
      autoReset
      autoResetDelay={3.5}
      style={{ height: "auto", minHeight: "1.2em" }}
    />
  );
}
