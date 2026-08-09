"use client";

import AsciiFire from "@/components/originkit/ui/ascii-flame";

/**
 * 区块过渡处的 ASCII 火焰动效（Originkit AsciiFire）
 * 用于深/浅区块交界，以「烽火」意象衔接（契合王朝衰亡主题）
 */
export function FlameTransition({
  tone = "dark",
  className = "",
}: {
  /** dark：深色区（亮焰）；light：浅色区（炭火感，低对比） */
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-0 h-32 w-full overflow-hidden md:h-44 ${className}`}
      aria-hidden="true"
    >
      <AsciiFire
        palette="custom"
        shades={
          tone === "dark"
            ? ["#5F2C21", "#791716", "#BF8567", "#D4A58C", "#E8C9B8", "#F5EFEA"]
            : ["#5F2C21", "#6E8F7E", "#74AE9F", "#AA967E", "#D8D2C6"]
        }
        sparkColor={tone === "dark" ? "#F5EFEA" : "#D8D2C6"}
        intensity={90}
        windDirection="right"
        windForce={8}
        decay={16}
        turbulence={34}
        thickness={1}
        embers
        sparks
        charset="classic"
        backgroundColor="transparent"
        style={{
          width: "100%",
          height: "100%",
          opacity: tone === "dark" ? 0.72 : 0.45,
        }}
      />
    </div>
  );
}
