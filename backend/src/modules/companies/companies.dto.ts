import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export const COMPANY_TYPES = ['oil_and_gas', 'mining', 'both', 'all'] as const;
export type CompanyTypeFilter = (typeof COMPANY_TYPES)[number];

export const STOCK_RANGES = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '5y', 'max'] as const;
export const STOCK_INTERVALS = ['1m', '5m', '15m', '30m', '1h', '1d', '1wk', '1mo'] as const;

export class ListCompaniesQueryDto {
  @ApiPropertyOptional({ enum: COMPANY_TYPES, example: 'oil_and_gas', description: 'Filter by company type. `all` (default) returns every company.' })
  @IsOptional() @IsIn(COMPANY_TYPES as unknown as string[])
  type?: CompanyTypeFilter;

  @ApiPropertyOptional({ example: 'ypf', description: 'Case-insensitive substring search across company name.' })
  @IsOptional() @IsString() q?: string;

  @ApiPropertyOptional({ example: 'Uranio', description: 'Only companies with at least one project of this commodity (case-insensitive).' })
  @IsOptional() @IsString() commodity?: string;

  @ApiPropertyOptional({ example: 'Argentina', description: 'Filter by country (case-insensitive exact match).' })
  @IsOptional() @IsString() country?: string;
}

export class StockHistoryQueryDto {
  @ApiPropertyOptional({ enum: STOCK_RANGES, default: '1mo', description: 'Lookback window.' })
  @IsOptional() @IsIn(STOCK_RANGES as unknown as string[])
  range?: string = '1mo';

  @ApiPropertyOptional({ enum: STOCK_INTERVALS, default: '1d', description: 'Sampling interval.' })
  @IsOptional() @IsIn(STOCK_INTERVALS as unknown as string[])
  interval?: string = '1d';
}
