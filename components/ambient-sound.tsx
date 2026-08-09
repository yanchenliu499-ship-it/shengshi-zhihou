"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 古琴余韵 —— WebAudio 合成的低音量环境音（古琴泛音 + 幽微底噪）
 * 默认关闭；用户点击铃铛开启/关闭（浏览器自动播放策略需用户手势）。
 */
export function AmbientSound() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pluck = (ctx: AudioContext, when: number) => {
    const scale = [220, 246.94, 293.66, 329.63, 392, 440]; // A 羽调五声
    const f = scale[Math.floor(Math.random() * scale.length)];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.05, when + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 2.8);
    osc.connect(gain).connect(ctx.destination);
    osc.start(when);
    osc.stop(when + 3);
    // 泛音（高八度，更"金石"）
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = "sine";
    o2.frequency.value = f * 2;
    g2.gain.setValueAtTime(0.0001, when);
    g2.gain.exponentialRampToValueAtTime(0.012, when + 0.02);
    g2.gain.exponentialRampToValueAtTime(0.0001, when + 1.6);
    o2.connect(g2).connect(ctx.destination);
    o2.start(when);
    o2.stop(when + 1.8);
  };

  const start = () => {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    ctxRef.current = ctx;
    // 幽微底噪（低通，模拟绢帛窸窣）
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
    noise.buffer = buffer;
    noise.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 220;
    const ng = ctx.createGain();
    ng.gain.value = 0.012;
    noise.connect(lp).connect(ng).connect(ctx.destination);
    noise.start();
    // 首音 + 定时泛音
    pluck(ctx, ctx.currentTime + 0.2);
    timerRef.current = setInterval(() => pluck(ctx, ctx.currentTime + 0.1), 3400 + Math.random() * 2200);
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    ctxRef.current?.close();
    ctxRef.current = null;
  };

  useEffect(() => () => stop(), []);

  return (
    <button
      type="button"
      onClick={() => {
        if (on) { stop(); setOn(false); }
        else { start(); setOn(true); }
      }}
      className="group fixed bottom-4 left-4 z-[100] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#791716]/25 bg-[#faf7f2]/80 text-[#791716] shadow-[0_2px_12px_rgba(44,36,22,0.12)] backdrop-blur-sm transition-all hover:bg-[#791716] hover:text-[#faf7f2]"
      aria-label={on ? "关闭古琴余韵" : "开启古琴余韵"}
      title={on ? "关闭古琴余韵" : "开启古琴余韵"}
    >
      {on ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M5 5l14 14" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M6 8l6-3v14l-6-3v-8z" fill="currentColor" fillOpacity="0.25" />
          <path d="M12 5l6 3v8l-6 3" />
          <path d="M16 8c2 1.5 2 6 0 8" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
