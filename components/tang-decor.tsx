import { BASE_PATH } from "@/lib/data";

/**
 * TangBackdrop —— 03「四阶段演变」深色板块背景层
 * 暗红画作 + 暖金氛围 + 压暗纱幕，叠在原有深色渐变之上，保持文字可读。
 */
export function TangBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `url("${BASE_PATH}/img/tang/bg-crimson.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: 0.34,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `url("${BASE_PATH}/img/tang/bg-warm.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center 70%",
          opacity: 0.12,
          mixBlendMode: "screen",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[#1C2330]/45" aria-hidden="true" />
    </>
  );
}

/**
 * TangDivider —— 纹样上下分界线（板块过渡装饰）
 * variant: "stripe"（纵条纹样，取自 _(7)）/ "band"（横条纹样，取自 _(6)）
 */
export function TangDivider({ variant = "stripe" }: { variant?: "stripe" | "band" }) {
  const src = variant === "stripe" ? "divider-stripe.png" : "divider-band.png";
  return (
    <div className="pointer-events-none relative h-12 w-full select-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `url("${BASE_PATH}/img/tang/${src}")`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
