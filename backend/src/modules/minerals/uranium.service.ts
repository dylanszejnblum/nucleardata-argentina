import { Injectable } from '@nestjs/common';
import { Prisma, UraniumProject, UraniumPrice } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  UraniumPricesQueryDto,
  UraniumProjectsQueryDto,
  UraniumTradeQueryDto,
  parseUraniumDate,
} from './uranium.dto';

const ADVANCED_STATUSES = new Set([
  'advanced_exploration',
  'preliminary_economic_assessment',
  'feasibility',
]);

@Injectable()
export class UraniumService {
  constructor(private readonly prisma: PrismaService) {}

  async projects(q: UraniumProjectsQueryDto) {
    const where: Prisma.UraniumProjectWhereInput = {};
    if (q.province) where.province = { equals: q.province, mode: 'insensitive' };
    if (q.status) where.status = { equals: q.status, mode: 'insensitive' };

    const rows = await this.prisma.uraniumProject.findMany({
      where,
      orderBy: { projectName: 'asc' },
    });

    return {
      count: rows.length,
      projects: rows.map((r) => this.shapeProject(r)),
    };
  }

  async prices(q: UraniumPricesQueryDto) {
    const from = parseUraniumDate(q.from);
    const to = parseUraniumDate(q.to);
    const where: Prisma.UraniumPriceWhereInput = {};
    if (from || to) {
      where.date = {};
      if (from) (where.date as Prisma.DateTimeFilter).gte = from;
      if (to) (where.date as Prisma.DateTimeFilter).lte = to;
    }

    const rows = await this.prisma.uraniumPrice.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    return {
      count: rows.length,
      prices: rows.map((r) => this.shapePrice(r)),
    };
  }

  async priceStats() {
    return this.computePriceStats();
  }

  async trade(q: UraniumTradeQueryDto) {
    const where: Prisma.UraniumTradeWhereInput = {};
    if (q.year !== undefined) where.year = q.year;

    const rows = await this.prisma.uraniumTrade.findMany({
      where,
      orderBy: [{ year: 'asc' }, { month: 'asc' }, { country: 'asc' }],
    });

    const imports: ReturnType<UraniumService['shapeTrade']>[] = [];
    const exports: ReturnType<UraniumService['shapeTrade']>[] = [];
    for (const r of rows) {
      (r.tradeType === 'export' ? exports : imports).push(this.shapeTrade(r));
    }

    return { imports, exports };
  }

  async summary() {
    const [projects, priceStats, facts] = await Promise.all([
      this.prisma.uraniumProject.findMany({
        select: { status: true, statusLabel: true, province: true },
      }),
      this.computePriceStats(),
      this.factMap(),
    ]);

    const projectsByStatus: Record<string, number> = {};
    const projectsByProvince: Record<string, number> = {};
    const provinces = new Set<string>();
    let advancedProjects = 0;

    for (const p of projects) {
      const label = p.statusLabel ?? p.status ?? 'unknown';
      projectsByStatus[label] = (projectsByStatus[label] ?? 0) + 1;
      if (p.province) {
        projectsByProvince[p.province] = (projectsByProvince[p.province] ?? 0) + 1;
        provinces.add(p.province);
      }
      if (p.status && ADVANCED_STATUSES.has(p.status)) advancedProjects++;
    }

    return {
      currentPrice: priceStats.current,
      currentDate: priceStats.current_date,
      priceChangePct: await this.priceChangePct(),
      totalResources: numericFact(facts.total_resources_tU),
      historicalProduction: numericFact(facts.historical_production_tU),
      activeProjects: projects.length,
      provincesWithProjects: provinces.size,
      advancedProjects,
      projectsByStatus,
      projectsByProvince,
      priceStats,
    };
  }

  private async computePriceStats() {
    const rows = await this.prisma.uraniumPrice.findMany({
      orderBy: { date: 'asc' },
      select: { date: true, priceUsd: true, unit: true },
    });

    if (rows.length === 0) {
      return {
        current: null,
        current_date: null,
        allTimeHigh: null,
        allTimeLow: null,
        decadeAverages: {},
        unit: 'USD/lb',
        total_data_points: 0,
      };
    }

    let high = rows[0];
    let low = rows[0];
    const decadeBuckets = new Map<string, { sum: number; n: number }>();
    for (const r of rows) {
      if (r.priceUsd > high.priceUsd) high = r;
      if (r.priceUsd < low.priceUsd) low = r;
      const decade = `${Math.floor(r.date.getUTCFullYear() / 10) * 10}s`;
      const b = decadeBuckets.get(decade) ?? { sum: 0, n: 0 };
      b.sum += r.priceUsd;
      b.n += 1;
      decadeBuckets.set(decade, b);
    }

    const decadeAverages: Record<string, number> = {};
    for (const [decade, b] of [...decadeBuckets.entries()].sort()) {
      decadeAverages[decade] = round2(b.sum / b.n);
    }

    const latest = rows[rows.length - 1];
    return {
      current: round2(latest.priceUsd),
      current_date: dateString(latest.date),
      allTimeHigh: { value: round2(high.priceUsd), date: dateString(high.date) },
      allTimeLow: { value: round2(low.priceUsd), date: dateString(low.date) },
      decadeAverages,
      unit: rows[0].unit,
      total_data_points: rows.length,
    };
  }

  private async priceChangePct(): Promise<number | null> {
    const last2 = await this.prisma.uraniumPrice.findMany({
      orderBy: { date: 'desc' },
      take: 2,
      select: { priceUsd: true },
    });
    if (last2.length < 2 || last2[1].priceUsd === 0) return null;
    return round2(((last2[0].priceUsd - last2[1].priceUsd) / last2[1].priceUsd) * 100);
  }

  private async factMap(): Promise<Record<string, unknown>> {
    const facts = await this.prisma.uraniumFact.findMany({ select: { key: true, value: true } });
    const out: Record<string, unknown> = {};
    for (const f of facts) out[f.key] = f.value;
    return out;
  }

  private shapeProject(r: UraniumProject) {
    return {
      name: r.projectName,
      latitude: r.latitude,
      longitude: r.longitude,
      province: r.province,
      province_code: r.provinceCode,
      status: r.status,
      status_label: r.statusLabel,
      mineral: r.mineral,
      controllers: r.controllers ?? [],
    };
  }

  private shapePrice(r: UraniumPrice) {
    return {
      date: dateString(r.date),
      price_usd: r.priceUsd,
      unit: r.unit,
      year: r.year,
      month: r.month,
      source: r.source,
    };
  }

  private shapeTrade(r: { year: number; month: number; tradeType: string; country: string; valueUsd: number; source: string }) {
    return {
      year: r.year,
      month: r.month,
      trade_type: r.tradeType,
      country: r.country,
      value_usd: r.valueUsd,
      source: r.source,
    };
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function dateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function numericFact(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
