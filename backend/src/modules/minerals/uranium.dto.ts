import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UraniumProjectsQueryDto {
  @ApiPropertyOptional({ example: 'Chubut', description: 'Filter by province (case-insensitive exact match).' })
  @IsOptional() @IsString() province?: string;

  @ApiPropertyOptional({
    example: 'advanced_exploration',
    description:
      'Filter by normalized status slug (case-insensitive): prospection | early_exploration | advanced_exploration | preliminary_economic_assessment | feasibility.',
  })
  @IsOptional() @IsString() status?: string;
}

export class UraniumPricesQueryDto {
  @ApiPropertyOptional({ example: '2020-01-01', description: 'Inclusive lower bound on price date (YYYY-MM or YYYY-MM-DD).' })
  @IsOptional() @IsString() @Matches(/^\d{4}-\d{2}(-\d{2})?$/)
  from?: string;

  @ApiPropertyOptional({ example: '2025-12-01', description: 'Inclusive upper bound on price date (YYYY-MM or YYYY-MM-DD).' })
  @IsOptional() @IsString() @Matches(/^\d{4}-\d{2}(-\d{2})?$/)
  to?: string;
}

export class UraniumTradeQueryDto {
  @ApiPropertyOptional({ example: 2023, description: 'Filter both imports and exports to a single year.' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1900)
  year?: number;
}

export function parseUraniumDate(v: string | undefined): Date | undefined {
  if (!v) return undefined;
  const parts = v.split('-').map(Number);
  if (parts.length === 2) return new Date(Date.UTC(parts[0], parts[1] - 1, 1));
  if (parts.length === 3) return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  return undefined;
}
