import { PrismaClient, Prisma } from '@prisma/client';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const prisma = new PrismaClient();

const FILE = resolve(
  process.cwd(),
  process.env.COMPANIES_FILE || '../data-pipeline/companies/companies_enriched.json',
);

interface RawCompany {
  slug?: string;
  name?: string;
  type?: string;
  sector?: string;
  country?: string | null;
  website?: string | null;
  logo_url?: string | null;
  stock_ticker?: string | null;
  stock_exchange?: string | null;
  is_public?: boolean;
  commodities?: unknown;
  provinces?: unknown;
  project_count_oil_gas?: unknown;
  project_count_mining?: unknown;
  oil_production_m3?: unknown;
  gas_production_m3?: unknown;
  boe_total?: unknown;
}

function str(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
}

function int(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

function floatOrNull(v: unknown): number | null {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function strArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x).trim()).filter(Boolean);
}

async function main() {
  const t0 = Date.now();
  console.log(`Seeding companies from: ${FILE}`);
  if (!existsSync(FILE)) throw new Error(`File not found: ${FILE}`);

  const raw = JSON.parse(readFileSync(FILE, 'utf-8')) as RawCompany[];
  const list = Array.isArray(raw) ? raw : [];

  let upserted = 0;
  let skipped = 0;
  for (const c of list) {
    const slug = str(c.slug);
    const name = str(c.name);
    if (!slug || !name) {
      skipped++;
      continue;
    }
    const data: Prisma.CompanyCreateInput = {
      slug,
      name,
      type: str(c.type) ?? 'mining',
      sector: str(c.sector) ?? 'mining',
      country: str(c.country),
      website: str(c.website),
      logoUrl: str(c.logo_url),
      stockTicker: str(c.stock_ticker),
      stockExchange: str(c.stock_exchange),
      isPublic: c.is_public === true,
      commoditySlugs: strArray(c.commodities),
      provinces: strArray(c.provinces),
      projectCountOilGas: int(c.project_count_oil_gas),
      projectCountMining: int(c.project_count_mining),
      oilProductionM3: floatOrNull(c.oil_production_m3),
      gasProductionM3: floatOrNull(c.gas_production_m3),
      boeTotal: floatOrNull(c.boe_total),
    };
    await prisma.company.upsert({ where: { slug }, create: data, update: data });
    upserted++;
  }

  console.log(`  companies: ${upserted} upserted, ${skipped} skipped`);
  console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(2)}s`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
