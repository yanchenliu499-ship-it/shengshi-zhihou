import { BottomNav } from "@/components/bottom-nav";
import { Deck, DeckProvider, Screen } from "@/components/deck";
import { Hero } from "@/components/hero";
import { TangTransition } from "@/components/tang-transition";
import { Timeline } from "@/components/timeline";
import { PalaceTurn } from "@/components/palace-turn";
import { TextExplorer } from "@/components/text-explorer";
import { ZhongxingSection } from "@/components/zhongxing";
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
import {
  ArchaeologyIcon,
  LdaIcon,
  NetworkIcon,
  ScrollIcon,
  SealIcon,
  SentimentIcon,
  VineBand,
} from "@/components/ornaments";

const METHODS = [
  {
    Icon: ScrollIcon,
    title: "语料库预处理",
    desc: "语料来自《全唐诗》中经关键词筛选与人工审核后确定的 444 首安史之乱相关诗歌。OCR 数字化、jieba 分词、词性过滤与去停用词统一预处理；停用词表采用哈工大停用词表并增补文言虚词，自定义词典增补「中兴」「豺狼」「幕府」「天宝」「潼关」「马嵬」等术语及其词性标注。",
  },
  {
    Icon: SealIcon,
    title: "时期划分与编年",
    desc: "大量诗歌纪年已不可考，故采取诗人—时期的映射策略，根据诗人的主要活动年代与政治代际将诗歌划入四个时期（肃宗—代宗 213 首、德宗—宪宗 100 首、穆宗—文宗 40 首、武宗—哀帝 60 首）；编年工作由腾讯 AI 智能体 WorkBuddy 判断、人工抽样校对。",
  },
  {
    Icon: LdaIcon,
    title: "LDA 主题建模",
    desc: "预处理仅保留名词（n/nz/vn），CountVectorizer 参数 max_features=800、max_df=0.6、min_df=2；经困惑度与 UMass 一致性双指标确定 K=5，四时期共 20 个主题；主题间距离以 Hellinger 距离 + MDS 投影 + Ward 层次聚类可视化。",
  },
  {
    Icon: NetworkIcon,
    title: "归因与话语检测",
    desc: "归因检测基于关键词映射规则，对诗歌中出现的归咎对象（安禄山、天命、李林甫、杨国忠等）进行提及计数；结合词频、词云追溯「中兴」「天宝」等关键政治话语在四时期的消长。",
  },
  {
    Icon: SentimentIcon,
    title: "双方法情感分析",
    desc: "采用人工情感词典（171 词：积极 46、消极 110、中性 15）与百度 Senta BiLSTM 模型双方法并行；Senta 词嵌入 128 维、双向 LSTM 198 维、softmax 二分类，并以卡方检验、Cramér's V 与双方法 Cohen's κ 对照验证。",
  },
  {
    Icon: ArchaeologyIcon,
    title: "关键词流变追踪",
    desc: "高频词以战争地理与军政机构（幕府、潼关、幽州、马嵬、将军）及政治话语（天子、中兴、天宝）为主；「中兴」「太平」判为正、「豺狼」「熊罴」「多难」判为负——追踪这些词汇在四时期的语义流变与代际迁移。",
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
    <div className={`rounded-2xl bg-white/65 p-4 shadow-[0_1px_0_rgba(44,36,22,0.04)] ring-1 ring-line/40 backdrop-blur-[2px] md:p-5 ${className}`}>
      <div className="mb-3 flex items-baseline gap-2.5">
        {num && (
          <span className="font-heading text-sm font-bold tracking-[0.2em] text-accent/60">{num}</span>
        )}
        <h3 className="font-heading text-base font-bold text-ink md:text-lg">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <DeckProvider>
      <Deck>
        {/* ============ 屏 0 · 封面 ============ */}
        <Hero />

        {/* ============ 屏 1 · 研究问题 ============ */}
        <Screen num="01" title="研究问题">
          <div className="mx-auto max-w-[760px] space-y-5">
            <div className="relative overflow-hidden rounded-2xl p-6 text-center shadow-[0_8px_32px_rgba(139,26,26,0.28)] md:p-8"
              style={{ background: "radial-gradient(ellipse at 50% 0%, #9d2a2a 0%, #7d1717 55%, #5e0f0f 100%)", border: "1px solid rgba(184,134,11,0.45)" }}>
              <VineBand className="mx-auto h-5 w-56 max-w-full opacity-80" tone="gold" />
              <p className="mt-2 font-heading text-2xl font-bold tracking-wide text-[#f7f4ec] md:text-3xl">核心提问</p>
              <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-[2] text-[#f5e9e9]/90 md:text-base">
                <strong className="text-white">唐人自认为他们的王朝何时走向了衰落？</strong>
                <br />这一认知在不同时期经历了怎样的变化？
              </p>
              <VineBand className="mx-auto mt-3 h-5 w-56 max-w-full opacity-80" tone="gold" />
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-line bg-card p-6 shadow-[0_2px_12px_rgba(44,36,22,0.08)] md:p-7">
              <div className="absolute inset-y-0 left-0 w-1" style={{ background: "linear-gradient(to bottom, #b8860b, #8b1a1a)" }} aria-hidden="true" />
              <p className="mb-3 pl-3 font-bold text-ink">研究路径</p>
              <p className="pl-3 text-[14px] leading-[2.1] text-ink-soft">
                以《全唐诗》444 首安史之乱相关诗歌为核心语料，围绕「唐人对安史之乱的认知变迁」开展三项互补的数字人文分析：
                <strong className="text-ink">情感分析</strong>——测量诗歌的整体情感倾向与四时期变化；
                <strong className="text-ink">LDA 主题建模</strong>——识别各时期核心议题及其跨期演变；
                <strong className="text-ink">文本与话语分析</strong>——通过词频、词云追溯关键政治话语的消长。
                三项任务相互独立、又彼此印证，以期得到对安史之乱的超视距观察。
              </p>
            </div>
          </div>
        </Screen>

        {/* ============ 屏 2 · 情感分析 ============ */}
        <Screen
          num="02"
          title="情感分析"
          subtitle="444 首安史之乱诗歌整体呈消极基调（消极 57.4%、平均情感 −0.160）；四时期无显著差异，穆宗—文宗却一反常态——消极降至四时期最低、积极升至最高"
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard num="02-01" title="📈 情感散点图 · 点击查看诗歌" className="lg:col-span-2">
              <p className="-mt-1 mb-2 text-xs text-ink-muted">每个点代表一首诗，纵轴为 Senta BiLSTM 模型情感分值（-1 负向 → +1 正向）。点击任意点弹出该诗正文卡片。</p>
              <ScatterChart />
            </ChartCard>
            <ChartCard num="02-02" title="态度构成演变">
              <p className="-mt-1 mb-2 text-xs text-ink-muted">四时期正 / 负 / 中性态度词比例变化</p>
              <AttitudeChart />
            </ChartCard>
            <ChartCard num="02-03" title="归因对象变迁">
              <p className="-mt-1 mb-2 text-xs text-ink-muted">各时期文本中主要「归咎对象」的提及频率变化</p>
              <BlameChart />
            </ChartCard>
            <ChartCard num="02-04" title="情感趋势" className="lg:col-span-2">
              <p className="-mt-1 mb-2 text-xs text-ink-muted">Senta 模型（整体语义）与人工情感词典（显性情感词）双方法对照</p>
              <KeywordTrendChart />
            </ChartCard>
          </div>
        </Screen>

        {/* ============ 屏 3 · 主题与话语 ============ */}
        <Screen
          num="03"
          title="主题与话语"
          subtitle="四时期分别建模（K=5，经困惑度与 UMass 一致性双指标检验），20 个主题呈现清晰的历时演变：前期以战争创伤与制度反思为核心，后期转向文化记忆与历史典故化"
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard num="03-01" title="主题流变 · 桑基图">
              <p className="-mt-1 mb-2 text-xs text-ink-muted">四时期之间核心主题的承继、断裂与演化关系，线条宽度表示主题继承强度</p>
              <SankeyChart />
            </ChartCard>
            <ChartCard num="03-02" title="🧪 LDA 最佳主题数检验">
              <p className="-mt-1 mb-2 text-xs text-ink-muted">对四时期分别测试 K=2–12：困惑度随 K 单调下降（过拟合信号），UMass 一致性因样本量而异。综合一致性、解释性与跨期可比性，K=5（现行）得到支持。</p>
              <LdaKChart />
            </ChartCard>
            <ChartCard num="03-03" title="🔬 LDA 主题聚类图 · 交互" className="lg:col-span-2">
              <p className="-mt-1 mb-2 text-xs text-ink-muted">20 个主题（K=5×4 时期）基于主题—词分布的 MDS 语义投影，点大小=主题占比。前期（创伤/反思）与后期（记忆/典故化）各成簇。</p>
              <LdaIntertopicChart />
            </ChartCard>
            <ChartCard num="03-04" title="🫧 四时期词频气泡图 · 词+诗人" className="lg:col-span-2">
              <p className="-mt-1 mb-2 text-xs text-ink-muted">各时期高频词与其关联诗人的共现网络，气泡大小代表词频，拖拽节点可探索</p>
              <BubbleGrid />
            </ChartCard>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-2">
              <TopicPanel />
              <WordPanel />
            </div>
            <div className="lg:col-span-2">
              <WordcloudPanel />
              <div className="mt-4"><IntertopicPanel /></div>
            </div>
          </div>
        </Screen>

        {/* ============ 屏 4 · 四阶段演变（深色） ============ */}
        <Screen num="04" title="四阶段演变" dark subtitle="将中晚唐历史划分为四个时期，追踪安史之乱叙事的代际演变——从战争创伤到历史典故化">
          <Timeline />
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#14110c] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] md:p-5">
            <h3 className="font-heading text-lg font-bold text-[#f7f4ec] md:text-xl">悬停查看各时期词云</h3>
            <p className="mb-3 mt-1 text-xs text-white/45">将鼠标移到时期上，对应词云随即浮现并跟随光标；其余时期自动变暗。</p>
            <div className="h-[300px]"><PeriodHoverReveal /></div>
          </div>
        </Screen>

        {/* ============ 屏 5 · 未完成的中兴 ============ */}
        <Screen
          num="05"
          title="未完成的中兴"
          subtitle="55 首含「中兴」诗作构成独特子语料库：肃宗—代宗 15 首 → 德宗—宪宗骤降至 2 首 → 穆宗—文宗回升 8 首 → 武宗—哀帝激增至 24 首——王朝将亡，呼唤愈发迫切，却始终未成"
        >
          <ZhongxingSection />
        </Screen>

        {/* ============ 屏 6 · 从战争到宫闱 ============ */}
        <Screen
          num="06"
          title="从战争到宫闱"
          subtitle="穆宗—文宗时期情感曲线一反常态：消极占比降至四时期最低、积极占比升至最高；宫闱词取代战争词——衰亡叙事由外患内移为朝纲与君德之思"
        >
          <PalaceTurn />
        </Screen>

        {/* ============ 屏 7 · 文本探索器 ============ */}
        <Screen num="07" title="文本探索器" subtitle="逐条浏览标注后的唐代文献片段，按时期、态度筛选或自由检索">
          <TextExplorer />
        </Screen>

        {/* ============ 屏 8 · 研究方法 ============ */}
        <Screen num="08" title="研究方法" subtitle="语料预处理 → 时期编年 → 主题建模 → 归因检测 → 双方法情感分析 → 关键词流变追踪">
          <div className="mx-auto max-w-[880px]">
            {METHODS.map((m, i) => (
              <div key={m.title} className="flex items-start gap-4 border-b border-line/50 py-5 last:border-b-0 md:gap-6">
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
            ))}
          </div>
        </Screen>

        {/* ============ 屏 9 · 结语 ============ */}
        <Screen num="09" title="结语" dark showNext={false} subtitle="安史之乱主题的《全唐诗》诗歌整体呈消极情感基调；贯穿始终的「中兴」「太平」「天子」寄托着希望，消极词汇却前后剧变——唐人四十余年呼唤中兴，终唐之世未再复兴，中晚唐诗中的「中兴」，始终是未完成的期待。">
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="text-center text-sm italic text-white/40">（团队成员信息待补充）</p>
          </div>
          <footer className="mt-10 shrink-0 border-t border-white/10 pt-8 text-center text-xs leading-[2] text-white/40">
            <p>首届大学生国际数字人文节（IDHFUS 2026）参展作品</p>
            <p>主题：遗产·记忆·视界 &nbsp;|&nbsp; 赛道：自选主题</p>
            <p>中国人民大学信息资源管理学院 · 数字人文研究院</p>
            <p className="mt-2">
              <a href="mailto:idhfus@ruc.edu.cn" className="text-[#c44d4d] underline-offset-2 hover:underline">
                idhfus@ruc.edu.cn
              </a>
            </p>
            <p className="mt-4 text-white/25">盛世之后 · 唐人视野中的王朝衰亡 — 宝相花 · 兵戈 · 敦煌飘带转场</p>
          </footer>
        </Screen>
      </Deck>

      <BottomNav />
      <TangTransition />
    </DeckProvider>
  );
}
