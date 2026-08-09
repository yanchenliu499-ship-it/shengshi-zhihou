import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";

const WAR_WORDS = ["豺狼", "幕府", "忠臣", "潼关", "两河", "妖氛", "多难", "风尘", "熊罴", "烟尘"];
const PALACE_WORDS = ["清宫", "霓裳", "珊瑚", "鹦鹉", "荔枝", "红粉", "楼台", "皇子", "妖星", "离宫"];

const STATS = [
  { value: "−0.20 → −0.12", label: "Senta 情感均值", note: "穆文期明显回升" },
  { value: "−0.36 → +0.35", label: "人工情感词典", note: "显性情感词转正" },
  { value: "30.1% → 56.1%", label: "正向态度占比", note: "近一倍上升" },
  { value: "3 / 5", label: "宫闱意象主题", note: "穆文期 LDA 主题" },
];

const POINTS: { title: string; body: string }[] = [
  {
    title: "战争记忆的退场",
    body: "安史之乱已过去六十年至八十年，直接创伤渐行渐远。穆宗—文宗时期，LDA 主题中战争词退居次要，宫闱词取而代之——渔阳鼙鼓、霓裳羽衣由创伤记忆沉淀为文化记忆，宫闱词汇的出现意味着人们越来越多地将变乱的原因深系宫闱。",
  },
  {
    title: "宫闱意象的隐喻",
    body: "鹦鹉：笼中才士、言路壅塞的写照；珊瑚：权贵珍宝，朝堂被宦官权臣把持而徒具其表；霓裳、荔枝、红粉：开元盛世享乐符号被反复重提，追忆与讽喻在同一组意象中交织。",
  },
  {
    title: "表面转暖，底里仍冷",
    body: "四阶段基本的情感曲线是消极占比不断升高，穆宗—文宗却一反常态：Senta 模型下消极占比 55.0%（四时期最低）、积极占比升至四时期最高；与人工词典法相对照（由 −0.36 转正至 +0.35），显性情感词转暖，语义底色依旧是失落与讽喻。",
  },
  {
    title: "历史语境",
    body: "穆宗—文宗时期宫闱体诗歌的兴起，主要因为清流文人逐渐式微，权相党争与宦官专权挤压了他们的生存空间：李商隐因牛李党争被双方排挤，温庭筠遭谗毁黜落，杜牧常年漂泊外官。他们并不生活在长安城的政治空间中，衰亡叙事的焦点由外患内移为朝纲与君德。",
  },
];

function StatCard({ value, label, note }: { value: string; label: string; note: string }) {
  return (
    <ScrollReveal className="h-full">
      <div className="h-full rounded-2xl border border-line bg-card p-5 shadow-[0_2px_12px_rgba(44,36,22,0.08)]">
        <div className="font-heading text-xl font-black text-accent md:text-2xl">{value}</div>
        <div className="mt-1.5 text-sm font-semibold text-ink">{label}</div>
        <div className="mt-0.5 text-xs text-ink-muted">{note}</div>
      </div>
    </ScrollReveal>
  );
}

function WordWall({ title, words, tone }: { title: string; words: string[]; tone: "war" | "palace" }) {
  return (
    <ScrollReveal className="h-full">
      <div className="h-full rounded-2xl border border-line bg-card p-6 shadow-[0_2px_12px_rgba(44,36,22,0.08)]">
        <h4 className={`font-heading text-base font-bold ${tone === "war" ? "text-ink" : "text-accent"}`}>
          {title}
        </h4>
        <div className="mt-4 flex flex-wrap gap-2">
          {words.map((w) => (
            <span
              key={w}
              className={`rounded-full px-3 py-1 text-sm ${
                tone === "war"
                  ? "bg-ink/5 text-ink-soft border border-line"
                  : "bg-accent-soft text-accent border border-accent/20"
              }`}
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

function PointCard({ title, body, delay }: { title: string; body: string; delay: number }) {
  return (
    <ScrollReveal delay={delay} className="h-full">
      <div className="h-full rounded-2xl border border-line bg-card p-6 shadow-[0_2px_12px_rgba(44,36,22,0.08)]">
        <p className="mb-2 font-heading text-lg font-bold text-ink">{title}</p>
        <p className="text-[13.5px] leading-[2] text-ink-soft">{body}</p>
      </div>
    </ScrollReveal>
  );
}

export function PalaceTurn({ children }: { children?: ReactNode }) {
  return (
    <div className="space-y-8">
      {/* 数据事实 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 60} className="h-full">
            <StatCard {...s} />
          </ScrollReveal>
        ))}
      </div>

      {/* 战争记忆 vs 宫闱意象 */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <WordWall title="战争记忆（肃代—德宪）" words={WAR_WORDS} tone="war" />
        <WordWall title="宫闱意象（穆宗—文宗）" words={PALACE_WORDS} tone="palace" />
      </div>

      {/* 分析要点 */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {POINTS.map((p, i) => (
          <PointCard key={p.title} {...p} delay={i * 60} />
        ))}
      </div>

      {/* 小结 */}
      <ScrollReveal>
        <div className="rounded-2xl border border-accent/25 bg-accent-soft p-6 md:p-7">
          <p className="mb-2 font-heading text-lg font-bold text-accent">小结</p>
          <p className="text-[14px] leading-[2] text-ink">
            从战争到宫闱，唐人衰亡叙事的焦点由「外患与叛军」内移为「朝纲与君德」。
            盛世的幻影与权力倾轧的现场，在同一批宫闱意象中重叠——
            这是「王朝已衰」的集体认知走向内省的关键一环。
          </p>
        </div>
      </ScrollReveal>

      {children}
    </div>
  );
}
