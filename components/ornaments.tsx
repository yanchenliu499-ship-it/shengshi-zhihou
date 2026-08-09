/* ============================================================
 * 装饰组件集 — 唐代学术风纹样（水墨山峦 / 祥云 / 朱砂印 / 回纹）
 * 全部为内联 SVG，配色沿用站点色板（绛红 #791716、赭石 #BF8567、黛蓝 #35475F）
 * ============================================================ */

/* ---------- 水墨山峦剪影（Hero 底部装饰） ---------- */
export function MountainScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 240"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      {/* 远山（最淡） */}
      <path
        d="M0 240 L0 150 L120 96 L250 150 L380 80 L520 150 L660 110 L800 160 L940 90 L1080 150 L1240 120 L1440 170 L1440 240 Z"
        fill="rgba(191,133,103,0.08)"
      />
      {/* 中景山 */}
      <path
        d="M0 240 L0 185 L160 130 L300 180 L470 120 L640 185 L820 140 L1000 190 L1180 135 L1360 185 L1440 160 L1440 240 Z"
        fill="rgba(53,71,95,0.24)"
      />
      {/* 近景山（最实） */}
      <path
        d="M0 240 L0 205 L180 160 L360 210 L560 165 L760 215 L980 175 L1180 215 L1360 180 L1440 205 L1440 240 Z"
        fill="rgba(28,35,48,0.50)"
      />
      {/* 一轮淡月 */}
      <circle cx="1210" cy="60" r="26" fill="rgba(191,133,103,0.14)" />
    </svg>
  );
}

/* ---------- 祥云纹（如意云，线稿） ---------- */
export function CloudScroll({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 42 C10 30 20 26 30 30 C34 22 48 20 54 28 C62 20 78 22 80 32 C92 30 104 36 102 44 C100 50 92 52 84 50 L22 50 C14 50 10 48 10 42 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path
        d="M30 38 C34 32 44 32 46 38"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M62 36 C66 30 78 30 80 37"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

/* ---------- 朱砂印章（篆刻风） ---------- */
export function SealStamp({
  text = "盛世",
  className = "",
  tone = "accent",
}: {
  text?: string;
  className?: string;
  tone?: "accent" | "gold";
}) {
  const fill = tone === "gold" ? "#BF8567" : "#791716";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {/* 印章外框 */}
      <rect x="2" y="2" width="60" height="60" rx="6" fill={fill} />
      <rect x="6" y="6" width="52" height="52" rx="4" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
      {/* 印文（竖排两字） */}
      <text
        x="32"
        y="30"
        textAnchor="middle"
        fontFamily="'Songti SC','Noto Serif SC',serif"
        fontWeight="700"
        fontSize="17"
        fill="#fff"
      >
        {text.slice(0, 1)}
      </text>
      <text
        x="32"
        y="50"
        textAnchor="middle"
        fontFamily="'Songti SC','Noto Serif SC',serif"
        fontWeight="700"
        fontSize="17"
        fill="#fff"
      >
        {text.slice(1, 2)}
      </text>
    </svg>
  );
}

/* ---------- 回纹框（章节编号装饰） ---------- */
export function FrettMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <path d="M4 4 H24 V24 H4 Z" stroke="currentColor" strokeWidth="1.2" opacity="0.9" />
      <path d="M8 8 H12 V12 H8 Z" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
      <path d="M16 16 H20 V20 H16 Z" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
      <path d="M8 20 H12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
      <path d="M20 8 H24" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/* ---------- 如意分隔纹（章节分隔线） ---------- */
export function DividerOrnament({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const c = dark ? "rgba(255,255,255,0.35)" : "rgba(121,23,22,0.45)";
  return (
    <svg viewBox="0 0 200 16" className={className} aria-hidden="true">
      <line x1="0" y1="8" x2="76" y2="8" stroke={c} strokeWidth="1" />
      <line x1="124" y1="8" x2="200" y2="8" stroke={c} strokeWidth="1" />
      {/* 中央如意 */}
      <path
        d="M100 3 C94 3 91 6 91 9 C91 12 94 14 100 14 C106 14 109 12 109 9 C109 6 106 3 100 3 Z"
        stroke={c}
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="100" cy="8.5" r="1.6" fill={c} />
    </svg>
  );
}

/* ============================================================
 * 研究方法 6 枚线稿图标（24×24，替代 emoji）
 * ============================================================ */

export function ScrollIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path d="M6 3h9a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
      <path d="M14 5h2v3h-2z" fill="currentColor" stroke="none" opacity="0.55" />
    </svg>
  );
}

export function SealIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <rect x="4" y="7" width="16" height="14" rx="2" strokeLinejoin="round" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M8 12h8M8 15.5h8M8 19h5" strokeLinecap="round" />
      <circle cx="17.5" cy="5" r="1.4" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  );
}

export function LdaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" strokeDasharray="2 2" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" strokeLinecap="round" opacity="0.7" />
      <circle cx="6.4" cy="6.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.6" cy="17.6" r="1" fill="currentColor" stroke="none" />
      <circle cx="6.4" cy="17.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function NetworkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="4.5" cy="6" r="1.7" />
      <circle cx="19.5" cy="5" r="1.7" />
      <circle cx="5" cy="18.5" r="1.7" />
      <circle cx="18.5" cy="17.5" r="1.7" />
      <path d="M10 10.8 6.2 7.2M14 10.8l5-5M11 13.6l-5 4M13.5 13.8l4.4 3.2" opacity="0.75" />
    </svg>
  );
}

export function SentimentIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      {/* 太极阴阳 */}
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18 4.5 4.5 0 0 0 0-9 4.5 4.5 0 0 1 0-9Z" fill="currentColor" stroke="none" opacity="0.35" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArchaeologyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      {/* 瓦当 */}
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5.5" strokeDasharray="2 2" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <path d="M12 3.5V6M12 18v2.5M3.5 12H6M18 12h2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}


/* ---------- 金色卷草纹带（图1：金色唐风纹样） ---------- */
export function VineBand({ className = "", tone = "gold" }: { className?: string; tone?: "gold" | "faint" }) {
  const stroke = tone === "gold" ? "#BF8567" : "rgba(191,133,103,0.5)";
  return (
    <svg viewBox="0 0 220 20" fill="none" className={className} aria-hidden="true">
      <line x1="0" y1="4" x2="220" y2="4" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
      <line x1="0" y1="16" x2="220" y2="16" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
      {[0, 44, 88, 132, 176].map((x) => (
        <g key={x} stroke={stroke} strokeWidth="1.1" fill="none" strokeLinecap="round">
          <path d={`M${x + 4} 10 C${x + 8} 4 ${x + 16} 4 ${x + 20} 10 C${x + 24} 16 ${x + 32} 16 ${x + 36} 10`} />
          <path d={`M${x + 20} 10 C${x + 20} 7 ${x + 22} 5 ${x + 25} 5`} opacity="0.8" />
          <circle cx={x + 40} cy="10" r="1.1" fill={stroke} stroke="none" />
        </g>
      ))}
    </svg>
  );
}

export const METHOD_ICONS = {
  ScrollIcon,
  SealIcon,
  LdaIcon,
  NetworkIcon,
  SentimentIcon,
  ArchaeologyIcon,
};
