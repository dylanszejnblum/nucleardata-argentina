import { PrismaClient, Prisma } from '@prisma/client';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const prisma = new PrismaClient();

const DATA_DIR = resolve(
  process.cwd(),
  process.env.URANIUM_DATA_DIR || '../data-pipeline/out_uranium_siacam',
);
const NORMALIZED = resolve(DATA_DIR, 'normalized');

function readJson<T>(filename: string): T {
  const path = resolve(NORMALIZED, filename);
  if (!existsSync(path)) throw new Error(`File not found: ${path}`);
  return JSON.parse(readFileSync(path, 'utf-8')) as T;
}

function asNumberOrNull(v: unknown): number | null {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function asIntOrNull(v: unknown): number | null {
  const n = asNumberOrNull(v);
  return n === null ? null : Math.trunc(n);
}

/**
 * The pipeline emits `controllers` as a Python-repr string, e.g.
 *   "[{'name': 'CNEA', 'ownership_pct': '1.0', 'origin_country': 'Argentina'}]"
 * Convert single-quoted keys/values to JSON and parse. Returns [] on failure.
 */
function parseControllers(raw: unknown): Prisma.InputJsonValue {
  if (Array.isArray(raw)) return raw as Prisma.InputJsonValue;
  if (typeof raw !== 'string' || raw.trim() === '') return [];
  try {
    const jsonish = raw
      .replace(/None/g, 'null')
      .replace(/'/g, '"');
    const parsed = JSON.parse(jsonish);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function monthDate(dateStr: string | undefined, year: unknown, month: unknown): Date {
  if (dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  }
  return new Date(Date.UTC(Number(year), Number(month) - 1, 1));
}

const FACT_LABELS: Record<string, { label: string; unit?: string }> = {
  total_resources_tU: { label: 'Recursos totales', unit: 'tU' },
  historical_production_tU: { label: 'Producción histórica', unit: 'tU' },
  production_years: { label: 'Años de producción' },
  last_production_year: { label: 'Último año de producción' },
  first_deposit_year: { label: 'Año del primer yacimiento' },
  first_deposit_location: { label: 'Ubicación del primer yacimiento' },
  first_yellowcake_year: { label: 'Año del primer yellowcake' },
  first_yellowcake_location: { label: 'Ubicación del primer yellowcake' },
  first_yellowcake_amount_t: { label: 'Cantidad del primer yellowcake', unit: 't' },
  identified_deposits: { label: 'Yacimientos identificados' },
  production_centers: { label: 'Centros de producción' },
  remediation_sites: { label: 'Sitios de remediación' },
  remediation_provinces: { label: 'Provincias con remediación' },
  producing_provinces: { label: 'Provincias productoras' },
  active_projects_count: { label: 'Proyectos activos' },
};

function humanize(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ProjectsFile {
  projects: Array<{
    project_name?: string;
    latitude?: unknown;
    longitude?: unknown;
    province?: string | null;
    province_code?: string | null;
    status?: string | null;
    status_label?: string | null;
    mineral?: string | null;
    controllers?: unknown;
  }>;
}

interface PricesFile {
  unit?: string;
  source?: string;
  prices: Array<{ date?: string; year?: unknown; month?: unknown; price_usd?: unknown }>;
}

interface TradeFile {
  records: Array<{
    year?: unknown;
    month?: unknown;
    country?: string | null;
    trade_type?: string;
    value_cif_usd?: unknown;
    value_fob_usd?: unknown;
  }>;
}

interface FactsFile {
  facts: Record<string, unknown>;
}

async function seedProjects(): Promise<number> {
  const data = readJson<ProjectsFile>('uranium_projects.json');
  const records: Prisma.UraniumProjectCreateManyInput[] = [];
  for (const p of data.projects ?? []) {
    const name = (p.project_name ?? '').trim();
    if (!name) continue;
    records.push({
      projectName: name,
      latitude: asNumberOrNull(p.latitude),
      longitude: asNumberOrNull(p.longitude),
      province: p.province ?? null,
      provinceCode: p.province_code ?? null,
      status: p.status ?? null,
      statusLabel: p.status_label ?? null,
      mineral: (p.mineral ?? 'Uranio').toString(),
      controllers: parseControllers(p.controllers),
    });
  }
  if (records.length) await prisma.uraniumProject.createMany({ data: records, skipDuplicates: true });
  return records.length;
}

async function seedPrices(): Promise<number> {
  const data = readJson<PricesFile>('uranium_prices.json');
  const unit = data.unit ?? 'USD/lb';
  const source = 'siacam';
  const records: Prisma.UraniumPriceCreateManyInput[] = [];
  for (const r of data.prices ?? []) {
    const price = asNumberOrNull(r.price_usd);
    if (price === null) continue;
    records.push({
      date: monthDate(r.date, r.year, r.month),
      priceUsd: price,
      unit,
      year: asIntOrNull(r.year),
      month: asIntOrNull(r.month),
      source,
    });
  }
  if (records.length) await prisma.uraniumPrice.createMany({ data: records, skipDuplicates: true });
  return records.length;
}

async function seedTrade(): Promise<{ imports: number; exports: number }> {
  const imports = readJson<TradeFile>('uranium_imports.json');
  const exports = readJson<TradeFile>('uranium_exports.json');
  const records: Prisma.UraniumTradeCreateManyInput[] = [];

  const collect = (file: TradeFile, defaultType: 'import' | 'export') => {
    let n = 0;
    for (const r of file.records ?? []) {
      const value = asNumberOrNull(r.value_cif_usd ?? r.value_fob_usd);
      const year = asIntOrNull(r.year);
      const month = asIntOrNull(r.month);
      if (value === null || year === null || month === null) continue;
      records.push({
        year,
        month,
        tradeType: (r.trade_type ?? defaultType).toString(),
        country: (r.country ?? '').toString(),
        valueUsd: value,
        source: 'siacam',
      });
      n++;
    }
    return n;
  };

  const importCount = collect(imports, 'import');
  const exportCount = collect(exports, 'export');
  if (records.length) await prisma.uraniumTrade.createMany({ data: records });
  return { imports: importCount, exports: exportCount };
}

async function seedFacts(): Promise<number> {
  const data = readJson<FactsFile>('uranium_facts.json');
  const records: Prisma.UraniumFactCreateManyInput[] = [];
  for (const [key, value] of Object.entries(data.facts ?? {})) {
    const meta = FACT_LABELS[key];
    records.push({
      key,
      value: (value ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      label: meta?.label ?? humanize(key),
      unit: meta?.unit ?? null,
    });
  }
  if (records.length) await prisma.uraniumFact.createMany({ data: records, skipDuplicates: true });
  return records.length;
}

async function main() {
  const t0 = Date.now();
  console.log(`Seeding uranium (SIACAM) from: ${DATA_DIR}`);
  if (!existsSync(NORMALIZED)) throw new Error(`Normalized dir not found: ${NORMALIZED}`);

  console.log('Clearing uranium tables...');
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "uranium_project", "uranium_price", "uranium_trade", "uranium_fact" RESTART IDENTITY',
  );

  const projects = await seedProjects();
  const prices = await seedPrices();
  const trade = await seedTrade();
  const facts = await seedFacts();

  console.log(`  projects: ${projects}`);
  console.log(`  prices:   ${prices}`);
  console.log(`  trade:    ${trade.imports} imports, ${trade.exports} exports`);
  console.log(`  facts:    ${facts}`);
  console.log(`\nDone in ${((Date.now() - t0) / 1000).toFixed(2)}s`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
