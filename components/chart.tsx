"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

export function EChart({
  option,
  className = "",
  onReady,
}: {
  option: echarts.EChartsOption;
  className?: string;
  onReady?: (chart: echarts.ECharts) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const chart = echarts.init(host);
    chartRef.current = chart;
    chart.setOption(option);
    onReady?.(chart);

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(host);
    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option]);

  return <div ref={hostRef} className={className} />;
}
