import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class ListProvincesQueryDto {
  @ApiPropertyOptional({ example: 'Uranio', description: 'Only provinces with at least one mineral project of this commodity (case-insensitive).' })
  @IsOptional() @IsString() commodity?: string;
}

export class ProvinceProductionQueryDto {
  @ApiPropertyOptional({ example: '2024-01', description: 'Inclusive lower bound for date_month (YYYY-MM or YYYY-MM-DD).' })
  @IsOptional() @IsString() @Matches(/^\d{4}-\d{2}(-\d{2})?$/)
  from?: string;

  @ApiPropertyOptional({ example: '2026-03', description: 'Inclusive upper bound for date_month (YYYY-MM or YYYY-MM-DD).' })
  @IsOptional() @IsString() @Matches(/^\d{4}-\d{2}(-\d{2})?$/)
  to?: string;
}

export function parseMonth(v: string | undefined): Date | undefined {
  if (!v) return undefined;
  const s = v.length === 7 ? `${v}-01` : v;
  const d = new Date(`${s}T00:00:00.000Z`);
  return isNaN(d.getTime()) ? undefined : d;
}
