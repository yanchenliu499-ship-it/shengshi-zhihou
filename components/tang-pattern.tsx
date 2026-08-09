import type { CSSProperties } from "react";

/** 唐代纹样类型 */
export type TangMotif = "meander" | "lozenge" | "vine" | "rosette" | "cloud";

const TILES: Record<TangMotif, { svg: string; tile: string }> = {
  // 回纹（key-fret 钩连）
  meander: {
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><g fill='none' stroke='{COLOR}' stroke-width='1'><path d='M12 12h16v6h-10v10h-6z'/><path d='M44 44h-16v-6h10V28h6z'/></g></svg>`,
    tile: "56px 56px",
  },
  // 菱格联珠（织物纹样 + 珠点）
  lozenge: {
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><g fill='none' stroke='{COLOR}' stroke-width='1'><rect x='14' y='14' width='28' height='28' transform='rotate(45 28 28)'/></g><g fill='{COLOR}'><circle cx='0' cy='0' r='1.6'/><circle cx='56' cy='0' r='1.6'/><circle cx='0' cy='56' r='1.6'/><circle cx='56' cy='56' r='1.6'/></g></svg>`,
    tile: "56px 56px",
  },
  // 卷草（唐草螺旋）
  vine: {
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><g fill='none' stroke='{COLOR}' stroke-width='1.1'><path d='M8 44c10-12 22-4 30-14'/><path d='M34 26c2-8 10-10 14-4 3 5-2 10-8 8'/><circle cx='30' cy='34' r='5'/></g></svg>`,
    tile: "64px 64px",
  },
  // 宝相花（四瓣团花 + 散点）
  rosette: {
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><g fill='none' stroke='{COLOR}' stroke-width='1'><path d='M32 14c4 5 9 9 14 14-5 5-10 9-14 14-4-5-9-9-14-14 5-5 10-9 14-14z'/><circle cx='32' cy='32' r='3.2' fill='{COLOR}'/><circle cx='6' cy='6' r='1.4' fill='{COLOR}'/><circle cx='58' cy='6' r='1.4' fill='{COLOR}'/><circle cx='6' cy='58' r='1.4' fill='{COLOR}'/><circle cx='58' cy='58' r='1.4' fill='{COLOR}'/></g></svg>`,
    tile: "64px 64px",
  },
  // 云纹（如意云头）
  cloud: {
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='48' viewBox='0 0 64 48'><g fill='none' stroke='{COLOR}' stroke-width='1.1'><path d='M14 26c0-6 6-10 12-8 3-5 10-5 13 0 5-2 9 1 9 6 0 4-3 7-7 7H21c-4 0-7-2-7-5z'/><path d='M46 30c0-3 3-5 6-4 2-3 6-3 7 0 2-1 4 1 4 3 0 2-2 4-4 4h-9c-2 0-4-1-4-3z'/></g></svg>`,
    tile: "64px 48px",
  },
};

/**
 * TangPattern —— 唐代纹样背景层（水印式，巧妙融入）
 * 极低透明度 + 径向渐隐遮罩（中部可见、边缘隐去），不干扰正文。
 */
export function TangPattern({
  motif = "meander",
  dark = false,
  className = "",
}: {
  motif?: TangMotif;
  dark?: boolean;
  className?: string;
}) {
  const color = dark ? "#e8dcc8" : "#2c2416";
  const tile = TILES[motif] ?? TILES.meander;
  const svg = tile.svg.replaceAll("{COLOR}", color);
  const mask =
    "radial-gradient(ellipse 90% 78% at 50% 40%, black 22%, transparent 82%)";
  const style: CSSProperties = {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundSize: tile.tile,
    opacity: dark ? 0.07 : 0.045,
    WebkitMaskImage: mask,
    maskImage: mask,
  };
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 select-none ${className}`}
      style={style}
    />
  );
}
