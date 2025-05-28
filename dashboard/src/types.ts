export interface SentimentData {
  created_dt: string;
  avg_sentiment: number;
}

export interface EngagementData {
  compound: number;
  score: number;
}

export interface FlairData {
  link_flair_text: string;
  avg_sentiment: number;
}

export interface ThreadData {
  title: string;
  compound: number;
}

export interface TopThreads {
  positive: ThreadData[];
  negative: ThreadData[];
}

export interface WordFreq {
  positive: Record<string, number>;
  negative: Record<string, number>;
}

export interface BigramFreq {
  positive: Record<string, number>;
  negative: Record<string, number>;
}

export interface TrigramFreq {
  positive: Record<string, number>;
  negative: Record<string, number>;
}

export interface TimeData {
  hour?: number;
  day_of_week?: string;
  compound: number;
}

export interface AuthorData {
  author: string;
  avg_sentiment: number;
  comment_count: number;
  total_score: number;
}