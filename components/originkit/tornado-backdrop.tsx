"use client";

import Vortex from "@/components/originkit/ui/tornado";

/**
 * TornadoBackdrop —— 深色封面下的粒子龙卷氛围层
 * 配色取自网站色板：金色粒子与流线（#c4b7a2 / #b8860b）+ 朱砂红彗星（#c44d4d），
 * 画布透明叠加在 Hero 深色渐变之上，仅作背景氛围。
 */
export function TornadoBackdrop() {
  return (
    <Vortex
      background="transparent"
      direction="right"
      speed={8}
      zoom={75}
      topRadius={340}
      waistRadius={50}
      waistPosition={50}
      bottomRadius={1000}
      twist={3}
      lineOptions={{ count: 150, color: "#c4b7a2", glow: 4 }}
      dots
      dotOptions={{ count: 3000, size: 14, color: "#c4b7a2", glow: 3, flicker: 6 }}
      comets
      cometOptions={{ count: 6, speed: 5, color: "#c44d4d", glow: 5, tail: 12, delay: 6, collide: 4 }}
    />
  );
}
