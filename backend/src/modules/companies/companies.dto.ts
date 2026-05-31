import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export const COMPANY_TYPES = ['oil_and_gas', 'mining', 'both', 'all'] as const;
export type CompanyTypeFilter = (typeof COMPANY_TYPES)[number];

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
