import { PrismaClient, Prisma } from '@prisma/client';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const prisma = new PrismaClient();

const ROOT = resolve(process.cwd(), process.env.PROVINCES_DIR || '../data-pipeline/provinces');
const ENRICHED = resolve(ROOT, 'provinces_enriched.json');
const NATIONAL = resolve(ROOT, 'province_exports.json');

interface KeyExport {
  sector?: string;
  product?: string;
  value_annual_usd?: unknown;
}
interface EnrichedProvince {
  slug?: string;
  name?: string;
  key_exports?: KeyExport[];
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function upsertExport(row: Prisma.ProvinceExportCreateInput): Promise<void> {
  await prisma.provinceExport.upsert({
    where: {
      slug_sector_productName: { slug: row.slug, sector: row.sector, productName: row.productName },
    },
    create: row,
    update: row,
  });
}

async function main() {
  const t0 = Date.now();
  console.log(`Seeding province exports from: ${ROOT}`);
  if (!existsSync(ENRICHED)) throw new Error(`File not found: ${ENRICHED}`);

  const enriched = JSON.parse(readFileSync(ENRICHED, 'utf-8')) as { provinces?: EnrichedProvince[] };
  let perProvince = 0;
  for (const p of enriched.provinces ?? []) {
    const name = (p.name ?? '').trim();
    const slug = (p.slug ?? slugify(name)).trim();
    if (!slug) continue;
    for (const e of p.key_exports ?? []) {
      const sector = (e.sector ?? '').trim();
      const product = (e.product ?? '').trim();
      if (!sector || !product) continue;
      await upsertExport({ slug, provinceName: name, sector, productName: product, valueAnnualUsd: num(e.value_annual_usd) });
      perProvince++;
    }
  }

  // National rollup (used by /provinces/export-summary as overall context).
  let national = 0;
  if (existsSync(NATIONAL)) {
    const nat = JSON.parse(readFileSync(NATIONAL, 'utf-8')) as { by_sector?: KeyExport[] };
    for (const e of nat.by_sector ?? []) {
      const sector = (e.sector ?? '').trim();
      const product = (e.product ?? '').trim();
      if (!sector || !product) continue;
      await upsertExport({ slug: 'nacional', provinceName: 'Total Nacional', sector, productName: product, valueAnnualUsd: num(e.value_annual_usd) });
      national++;
    }
  }

  console.log(`  province exports: ${perProvince} per-province rows, ${national} national rows`);
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
