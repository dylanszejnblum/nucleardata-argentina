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

interface YahooChartMeta {
  currency?: string | null;
  exchangeName?: string | null;
  regularMarketPrice?: number | null;
  chartPreviousClose?: number | null;
  previousClose?: number | null;
  regularMarketTime?: number | null;
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
