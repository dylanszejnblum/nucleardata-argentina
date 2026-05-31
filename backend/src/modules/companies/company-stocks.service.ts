import { Injectable, Logger } from '@nestjs/common';

export interface StockQuote {
  ticker: string;
  price: number | null;
  change: number | null;
  change_pct: number | null;
  currency: string | null;
  exchange: string | null;
  market_time: string | null;
}

export interface StockHistoryPoint {
  date: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

export interface StockHistory {
  ticker: string;
  currency: string | null;
  exchange: string | null;
  current_price: number | null;
  change_pct: number | null;
  high_52w: number | null;
  low_52w: number | null;
  range: string;
  interval: string;
  history: StockHistoryPoint[];
}

interface YahooChartMeta {
  currency?: string | null;
  exchangeName?: string | null;
  regularMarketPrice?: number | null;
  chartPreviousClose?: number | null;
  previousClose?: number | null;
  regularMarketTime?: number | null;
  fiftyTwoWeekHigh?: number | null;
  fiftyTwoWeekLow?: number | null;
}

interface YahooChartResult {
  meta: YahooChartMeta;
  timestamp?: number[] | null;
  indicators?: {
    quote?: Array<{
      open?: Array<number | null>;
      high?: Array<number | null>;
      low?: Array<number | null>;
      close?: Array<number | null>;
      volume?: Array<number | null>;
    }>;
  };
}

interface CacheEntry {
  ts: number;
  data: StockQuote;
}

/**
 * Live equity quotes from Yahoo Finance, cached 5 minutes per ticker so we
 * never hit Yahoo on every request. Failures degrade to a null-price quote.
 */
@Injectable()
export class CompanyStocksService {
  private readonly logger = new Logger(CompanyStocksService.name);
  private readonly cache = new Map<string, CacheEntry>();
  private readonly historyCache = new Map<string, { ts: number; data: StockHistory }>();
  private readonly ttlMs = 5 * 60 * 1000;
  private readonly fetchTimeoutMs = 5_000;
  private readonly endpoint = 'https://query1.finance.yahoo.com/v8/finance/chart';

  /** Fetch quotes for many tickers in parallel (each independently cached). */
  async quotes(tickers: string[]): Promise<StockQuote[]> {
    const unique = [...new Set(tickers.filter(Boolean))];
    return Promise.all(unique.map((t) => this.quote(t)));
  }

  async quote(ticker: string): Promise<StockQuote> {
    const now = Date.now();
    const cached = this.cache.get(ticker);
    if (cached && now - cached.ts < this.ttlMs) return cached.data;

    const data = await this.fetchQuote(ticker);
    this.cache.set(ticker, { ts: now, data });
    return data;
  }

  /**
   * Daily (or finer) OHLCV history for one symbol over a range. Returns null
   * when Yahoo has no data for the symbol (caller maps that to a 404).
   */
  async history(symbol: string, range: string, interval: string): Promise<StockHistory | null> {
    const key = `${symbol}|${range}|${interval}`;
    const now = Date.now();
    const cached = this.historyCache.get(key);
    if (cached && now - cached.ts < this.ttlMs) return cached.data;

    const data = await this.fetchHistory(symbol, range, interval);
    if (data) this.historyCache.set(key, { ts: now, data });
    return data;
  }

  private async fetchHistory(symbol: string, range: string, interval: string): Promise<StockHistory | null> {
    const url = `${this.endpoint}/${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`;
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), this.fetchTimeoutMs);
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (minerals-api)' },
        signal: ac.signal,
      });
      if (!res.ok) {
        this.logger.warn(`Yahoo history ${symbol} → HTTP ${res.status}`);
        return null;
      }
      const json = (await res.json()) as {
        chart: { result: YahooChartResult[] | null; error: { code: string; description?: string } | null };
      };
      if (json.chart.error || !json.chart.result?.[0]) {
        this.logger.warn(`Yahoo history ${symbol} → ${json.chart.error?.code ?? 'no result'}`);
        return null;
      }
      return this.parseHistory(symbol, range, interval, json.chart.result[0]);
    } catch (err) {
      this.logger.warn(`Yahoo history ${symbol} fetch failed: ${(err as Error).message}`);
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  private parseHistory(symbol: string, range: string, interval: string, result: YahooChartResult): StockHistory {
    const meta = result.meta;
    const ts = result.timestamp ?? [];
    const q = result.indicators?.quote?.[0] ?? {};
    const history: StockHistoryPoint[] = [];
    for (let i = 0; i < ts.length; i++) {
      const close = numOrNull(q.close?.[i]);
      const open = numOrNull(q.open?.[i]);
      const high = numOrNull(q.high?.[i]);
      const low = numOrNull(q.low?.[i]);
      const volume = numOrNull(q.volume?.[i]);
      // Yahoo leaves null gaps for non-trading slots; drop rows with no close.
      if (close === null && open === null) continue;
      history.push({
        date: new Date(ts[i] * 1000).toISOString().slice(0, 10),
        open: open === null ? null : round(open, 2),
        high: high === null ? null : round(high, 2),
        low: low === null ? null : round(low, 2),
        close: close === null ? null : round(close, 2),
        volume: volume === null ? null : Math.round(volume),
      });
    }

    // Change over the most recent interval (range-independent), computed from
    // the last two closes so it stays meaningful at any range/interval.
    const closes = history.map((p) => p.close).filter((c): c is number => c !== null);
    const last = closes[closes.length - 1] ?? null;
    const prevClose = closes.length >= 2 ? closes[closes.length - 2] : numOrNull(meta.chartPreviousClose ?? meta.previousClose);
    const price = numOrNull(meta.regularMarketPrice) ?? last;
    const change_pct = last !== null && prevClose !== null && prevClose !== 0 ? round(((last - prevClose) / prevClose) * 100, 2) : null;

    return {
      ticker: symbol,
      currency: meta.currency ?? null,
      exchange: meta.exchangeName ?? null,
      current_price: price,
      change_pct,
      high_52w: numOrNull(meta.fiftyTwoWeekHigh),
      low_52w: numOrNull(meta.fiftyTwoWeekLow),
      range,
      interval,
      history,
    };
  }

  private async fetchQuote(ticker: string): Promise<StockQuote> {
    const url = `${this.endpoint}/${encodeURIComponent(ticker)}?interval=1d&range=5d`;
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), this.fetchTimeoutMs);
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (minerals-api)' },
        signal: ac.signal,
      });
      if (!res.ok) {
        this.logger.warn(`Yahoo ${ticker} → HTTP ${res.status}`);
        return this.empty(ticker);
      }
      const json = (await res.json()) as {
        chart: { result: Array<{ meta: YahooChartMeta }> | null; error: { code: string } | null };
      };
      if (json.chart.error) {
        this.logger.warn(`Yahoo ${ticker} → ${json.chart.error.code}`);
        return this.empty(ticker);
      }
      const meta = json.chart.result?.[0]?.meta;
      return meta ? this.fromMeta(ticker, meta) : this.empty(ticker);
    } catch (err) {
      this.logger.warn(`Yahoo ${ticker} fetch failed: ${(err as Error).message}`);
      return this.empty(ticker);
    } finally {
      clearTimeout(timer);
    }
  }

  private fromMeta(ticker: string, meta: YahooChartMeta): StockQuote {
    const price = numOrNull(meta.regularMarketPrice);
    const prev = numOrNull(meta.chartPreviousClose ?? meta.previousClose);
    const change = price !== null && prev !== null ? round(price - prev, 2) : null;
    const change_pct = price !== null && prev !== null && prev !== 0 ? round(((price - prev) / prev) * 100, 2) : null;
    return {
      ticker,
      price,
      change,
      change_pct,
      currency: meta.currency ?? null,
      exchange: meta.exchangeName ?? null,
      market_time: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : null,
    };
  }

  private empty(ticker: string): StockQuote {
    return { ticker, price: null, change: null, change_pct: null, currency: null, exchange: null, market_time: null };
  }
}

/**
 * Yahoo needs an exchange suffix for non-US listings (e.g. TSX-V → `.V`,
 * Buenos Aires → `.BA`). US tickers resolve bare.
 */
export function yahooSymbol(ticker: string, exchange: string | null): string {
  if (ticker.includes('.')) return ticker;
  const ex = (exchange ?? '').toUpperCase();
  if (ex.includes('TSX-V') || ex.includes('TSXV') || ex.includes('TSX.V')) return `${ticker}.V`;
  if (ex === 'TSX' || ex.includes('TORONTO')) return `${ticker}.TO`;
  if (ex.includes('BCBA') || ex.includes('BYMA') || ex.includes('BUENOS')) return `${ticker}.BA`;
  return ticker;
}

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function round(n: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}
