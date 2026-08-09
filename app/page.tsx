import { BottomNav } from "@/components/bottom-nav";
import { Hero } from "@/components/hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  ArchaeologyIcon,
  LdaIcon,
  NetworkIcon,
  ScrollIcon,
  SealIcon,
  SentimentIcon,
  VineBand,
} from "@/components/ornaments";
import { Section, SectionHeader } from "@/components/section";
import { Timeline } from "@/components/timeline";
import { PalaceTurn } from "@/components/palace-turn";
import { TextExplorer } from "@/components/text-explorer";
import { ZhongxingSection } from "@/components/zhongxing";
import { TangBackdrop, TangDivider } from "@/components/tang-decor";
import { PeriodHoverReveal } from "@/components/originkit/period-hover-reveal";
import { ScatterChart } from "@/components/charts/scatter-chart";
import { AttitudeChart, BlameChart, KeywordTrendChart } from "@/components/charts/sentiment-charts";
import { SankeyChart } from "@/components/charts/sankey-network";
import { LdaKChart } from "@/components/charts/lda-k-chart";
import { LdaIntertopicChart } from "@/components/charts/lda-intertopic";
import {
  BubbleGrid,
  IntertopicPanel,
  TopicPanel,
  WordPanel,
  WordcloudPanel,
} from "@/components/charts/panels";

const METHODS = [
  {
    Icon: ScrollIcon,
    title: "语料库构建",
    desc: "从《旧唐书》《全唐文》《全唐诗》及唐人笔记中筛选提及安史之乱的文本片段，按作者、年代、体裁标注元数据，构建结构化语料库。",
  },
  {
    Icon: SealIcon,
    title: "命名实体识别",
    desc: "利用 MARKUS 半自动标注平台 + CBDB 人物数据库，对文本中的人名、地名、时间、官职进行实体识别与消歧链接。",
  },
  {
    Icon: LdaIcon,
    title: "LDA 主题建模",
    desc: "对四个时期的语料分别进行 LDA 主题建模，通过困惑度与主题一致性（UMass）检验确定主题数，提取各时期核心议题，并以 MDS 投影与层次聚类可视化主题语义空间，追踪主题跨时期的演变路径。",
  },
  {
    Icon: NetworkIcon,
    title: "社会网络分析",
    desc: "构建「人物—事件」「人物—主题」的二模网络，可视化不同时期的话语权力格局与信息流动。",
  },
  {
    Icon: SentimentIcon,
    title: "情感态度分析",
    desc: "基于古文情感词典 + 百度 Senta BiLSTM 模型双方法对文本情感打分，对照「显性情感词」与「整体语义基调」的差异，并标注态度倾向（哀恸/愤怒/反思/冷漠/辩护），绘制态度演变曲线。",
  },
  {
    Icon: ArchaeologyIcon,
    title: "话语考古",
    desc: "追踪「天宝」「中兴」「贰臣」「忠节」等关键概念在唐代文献中的语义流变，揭示观念建构的代际过程。",
  },
];

function ChartCard({
  num,
  title,
  children,
  className = "",
}: {
  num?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ScrollReveal className={className}>
      <div className="rounded-2xl bg-[#FDFCFA]/65 p-5 shadow-[0_1px_0_rgba(53,71,95,0.04)] ring-1 ring-line/40 backdrop-blur-[2px] md:p-6">
        <div className="mb-4 flex items-baseline gap-3">
          {num && (
            <span className="font-heading text-sm font-bold tracking-[0.2em] text-accent/60">
              {num}
            </span>
          )}
          <h3 className="font-heading text-lg font-bold text-ink md:text-xl">{title}</h3>
        </div>
        {children}
      </div>
    </ScrollReveal>
  );
}

export default function HomePage() {
  return (
    <main>
      <Hero />

      {/* 01 研究问题 */}
      <Section id="about" flame topGradient="linear-gradient(to bottom, #1C2330 0%, #FDFCFA 100%)">
        <SectionHeader num="01" title="研究问题" />
        <div className="mx-auto max-w-[760px] space-y-5">
          <ScrollReveal>
            <div
              className="relative overflow-hidden rounded-2xl p-6 text-center shadow-[0_8px_32px_rgba(121,23,22,0.22)] md:p-8"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, #791716 0%, #5F2C21 55%, #35475F 100%)",
                border: "1px solid rgba(191,133,103,0.45)",
              }}
            >
              {/* 金色卷草纹带：上 / 下 */}
              <VineBand className="mx-auto h-5 w-56 max-w-full opacity-80" tone="gold" />
              <p className="mt-2 font-heading text-2xl font-bold tracking-wide text-[#F7F5F1] md:text-3xl">
                核心提问
              </p>
              <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-[2] text-[#F5EFEA]/90 md:text-base">
                <strong className="text-[#FDFCFA]">
                  唐人自认为他们的王朝何时走向了衰落？
                </strong>
                <br />
                这一认知在不同时期经历了怎样的变化？
              </p>
              <VineBand className="mx-auto mt-3 h-5 w-56 max-w-full opacity-80" tone="gold" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="relative overflow-hidden rounded-2xl border border-line bg-card p-6 shadow-[0_2px_12px_rgba(53,71,95,0.06)] md:p-7">
              <div
                className="absolute inset-y-0 left-0 w-1"
                style={{
                  background:
                    "linear-gradient(to bottom, #BF8567, #791716)",
                }}
                aria-hidden="true"
              />
              <p className="mb-3 pl-3 font-bold text-ink">研究路径</p>
              <p className="pl-3 text-[14px] leading-[2.1] text-ink-soft">
                全唐诗文本（444 首安史之乱相关）→ 人工审核 →{" "}
                <strong className="text-ink">jieba 分词+词性标注</strong> →{" "}
                <strong className="text-ink">TF-IDF 关键词提取</strong> →{" "}
                <strong className="text-ink">LDA 主题建模</strong>
                （每时期 K=5，经困惑度/一致性检验，共计 20 个主题）→{" "}
                <strong className="text-ink">情感词典+人工校验</strong>（171 词）→{" "}
                <strong className="text-ink">四阶段追踪</strong>（肃代/德宪/穆文/武哀）
              </p>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* 02 数据分析 */}
      <Section id="analysis" className="!bg-paper-deep">
        <SectionHeader
          num="02"
          title="数据分析"
          subtitle="基于语料库的多维度文本分析，揭示唐代衰亡叙事的深层结构"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard num="02-01" title="📈 情感散点图 · 点击查看诗歌" className="lg:col-span-2">
            <p className="-mt-2 mb-3 text-xs text-ink-muted">
              每个点代表一首诗，纵轴为 Senta BiLSTM 模型情感分值（-1 负向 → +1 正向）。点击任意点弹出该诗的词频与正文卡片。
            </p>
            <ScatterChart />
          </ChartCard>

          <ChartCard num="02-02" title="态度构成演变">
              <p className="-mt-2 mb-3 text-xs text-ink-muted">四时期正 / 负 / 中性态度词比例变化</p>
              <AttitudeChart />
          </ChartCard>
          <ChartCard num="02-03" title="归因对象变迁">
              <p className="-mt-2 mb-3 text-xs text-ink-muted">各时期文本中主要「归咎对象」的提及频率变化</p>
              <BlameChart />
          </ChartCard>
          <ChartCard num="02-04" title="情感趋势">
              <p className="-mt-2 mb-3 text-xs text-ink-muted">Senta 模型（整体语义）与人工情感词典（显性情感词）双方法对照</p>
              <KeywordTrendChart />
          </ChartCard>
          <ChartCard num="02-05" title="主题流变 · 桑基图">
              <p className="-mt-2 mb-3 text-xs text-ink-muted">
                四个时期之间核心主题的承继、断裂与演化关系，线条宽度表示主题继承强度
              </p>
              <SankeyChart />
          </ChartCard>

          <ChartCard title="🧪 LDA 最佳主题数检验" className="lg:col-span-2">
            <p className="-mt-2 mb-3 text-xs text-ink-muted">
              对四时期分别测试 K=2–12：困惑度随 K 单调下降（过拟合信号），UMass 一致性因样本量而异。
              综合一致性、解释性与跨期可比性，K=5（现行）得到支持。
            </p>
            <LdaKChart />
          </ChartCard>

          <ChartCard title="🔬 LDA 主题聚类图 · 交互" className="lg:col-span-2">
            <p className="-mt-2 mb-3 text-xs text-ink-muted">
              20 个主题（K=5×4 时期）基于主题—词分布的 MDS 语义投影，点大小=主题占比。
              前期（创伤/反思）与后期（记忆/典故化）各成簇。
            </p>
            <LdaIntertopicChart />
          </ChartCard>

          <ChartCard num="02-06" title="🫧 四时期词频气泡图 · 词+诗人" className="lg:col-span-2">
            <p className="-mt-2 mb-3 text-xs text-ink-muted">
              各时期高频词与其关联诗人的共现网络，气泡大小代表词频，拖拽节点可探索
            </p>
            <BubbleGrid />
          </ChartCard>

          <div className="grid grid-cols-1 gap-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TopicPanel />
              <WordPanel />
            </div>
            <WordcloudPanel />
            <IntertopicPanel />
          </div>
        </div>
      </Section>

      <TangDivider variant="stripe" />

      {/* 03 四阶段演变（深色） */}
      <Section id="timeline" dark flame className="!py-24 md:!py-32" topGradient="linear-gradient(to bottom, #E7E2D8 0%, #1C2330 100%)">
        <TangBackdrop />
        <SectionHeader
          num="03"
          title="四阶段演变"
          subtitle="我们将中晚唐历史划分为四个时期，追踪安史之乱叙事的代际演变"
          dark
        />
        <Timeline />

        {/* 悬停查看各时期词云 */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-[#1C2330] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] md:p-6">
          <h3 className="font-heading text-lg font-bold text-[#F7F5F1] md:text-xl">悬停查看各时期词云</h3>
          <p className="mb-4 mt-1 text-xs text-white/45">
            将鼠标移到时期上，对应词云随即浮现并跟随光标；其余时期自动变暗。
          </p>
          <div className="h-[340px]">
            <PeriodHoverReveal />
          </div>
        </div>
      </Section>

      <TangDivider variant="band" />

      {/* 04 未完成的中兴 */}
      <Section id="zhongxing" className="!bg-paper-deep">
        <SectionHeader
          num="04"
          title="未完成的中兴"
          subtitle="全语料词频第 3 的政治关键词——经词性修正已回归 LDA 主题，唐人四十年未竟的中兴期待"
        />
        <ZhongxingSection />
      </Section>

      {/* 05 从战争到宫闱（穆宗—文宗深读） */}
      <Section
        id="palace"
        className="!bg-paper-deep"
        topGradient="linear-gradient(to bottom, #1C2330 0%, #E7E2D8 100%)"
      >
        <SectionHeader
          num="05"
          title="从战争到宫闱"
          subtitle="穆宗—文宗时期：情感微升、主题词由战场转向宫闱——唐人的衰亡叙事如何内移为朝纲与君德之思"
        />
        <PalaceTurn />
      </Section>

      {/* 06 文本探索器（书签弹窗） */}
      <Section id="texts">
        <SectionHeader
          num="06"
          title="文本探索器"
          subtitle="点击右侧书签，逐条浏览标注后的唐代文献片段，按时期、态度筛选或自由检索"
        />
        <div className="text-center">
          <p className="text-sm text-ink-muted">→ 点击页面右侧的赭石色书签，打开文本探索面板</p>
        </div>
      </Section>

      {/* 07 研究方法 */}
      <Section id="method" className="!bg-paper-deep">
        <SectionHeader num="07" title="研究方法" />
        <div className="mx-auto max-w-[880px]">
          {METHODS.map((m, i) => (
            <ScrollReveal key={m.title} delay={i * 40}>
              <div className="flex items-start gap-4 border-b border-line/50 py-6 last:border-b-0 md:gap-6">
                <span className="shrink-0 font-heading text-2xl font-black leading-none text-accent/60 md:text-3xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent md:h-12 md:w-12">
                  <m.Icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading text-lg font-bold text-ink">{m.title}</h4>
                  <p className="mt-1.5 text-[13px] font-light leading-[1.8] text-ink-soft">{m.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* 08 团队 + 页脚 */}
      <Section id="team" dark className="!py-16" topGradient="linear-gradient(to bottom, #E7E2D8 0%, #1C2330 100%)">
        <SectionHeader num="08" title="团队成员" dark />
        <div className="mx-auto max-w-[600px] space-y-6">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-sm">
            <div className="font-heading text-lg font-bold text-white">刘彦辰</div>
            <div className="text-sm text-white/60">北京师范大学 2023级历史学（强基计划）专业本科生</div>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-sm">
            <div className="font-heading text-lg font-bold text-white">张浩歌</div>
            <div className="text-sm text-white/60">北京师范大学 2023级历史学（强基计划）专业本科生</div>
          </div>
        </div>
        <footer className="mt-14 border-t border-white/10 pt-8 text-center text-xs leading-[2] text-white/40">
          <p className="mt-4 text-white/25">盛世之后 · 唐人视野中的王朝衰亡</p>
        </footer>
      </Section>

      <BottomNav />
      <TextExplorer />
    </main>
  );
}
