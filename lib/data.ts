export interface PoemPoint {
  author: string;
  period: string;
  title: string;
  text: string;
  source: string;
  word_count: number;
  sentiment: number;
  positive_words: number;
  negative_words: number;
  blame_target: string;
}

export interface SentimentData {
  periods: string[];
  attitudes: Record<string, number>[];
  blameAttribution: Record<string, number>[];
  /** Senta BiLSTM 模型（语义）平均情感 */
  sentiment_trend: { period: string; avg: number }[];
  /** 人工情感词典（显性情感词）平均情感 */
  lexicon_trend: { period: string; avg: number }[];
}

export interface TopicFlow {
  source: string;
  target: string;
  value: number;
}

export interface TopicItem {
  period: string;
  topic_id: string;
  core_words: string[];
  all_words: string[];
}

export interface TopicsData {
  periods: string[];
  flows: TopicFlow[];
  topics: TopicItem[];
}

export interface NetworkData {
  nodes: { id: string; category: string; period: string; value: number }[];
  links: { source: string; target: string; value: number }[];
}

export interface WordItem {
  word: string;
  freq: number;
  sentiment: number;
}

export interface BubbleWord {
  word: string;
  freq: number;
  poets: { name: string; count: number }[];
}

export interface BubblePeriod {
  period: string;
  poem_count: number;
  words: BubbleWord[];
}

export interface TextEntry {
  id: number;
  author: string;
  period: string;
  title: string;
  source: string;
  genre: string;
  text: string;
  sentiment: number;
  sentiment_label: string;
  positive_words: number;
  negative_words: number;
  blame_target: string;
}

export interface TimelinePeriod {
  id: string;
  period: string;
  years: string;
  label: string;
  summary: string;
  keyFigures: string[];
  dominantThemes: string[];
  attitude: string;
  poemCount: number;
  sentimentAvg: number;
}

export interface LdaKSeries {
  perplexity: number[];
  coherence: number[];
}

export interface LdaKData {
  periods: string[];
  k_range: number[];
  series: Record<string, LdaKSeries>;
  recommended_k: number;
}

export interface LdaTopicPoint {
  period: string;
  topic_id: number;
  x: number;
  y: number;
  prevalence: number;
  top_words: string;
  top5: string[];
}

export interface LdaIntertopicData {
  periods: string[];
  topics: LdaTopicPoint[];
}

export const PERIOD_ORDER: Record<string, number> = {
  "肃宗—代宗": 0,
  "德宗—宪宗": 1,
  "穆宗—文宗": 2,
  "武宗—哀帝": 3,
};

export const PERIOD_COLORS = ["#791716", "#BF8567", "#5F2C21", "#AA967E"];

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_PATH}${path}`);
  if (!res.ok) throw new Error(`加载失败: ${path} (${res.status})`);
  return res.json() as Promise<T>;
}
