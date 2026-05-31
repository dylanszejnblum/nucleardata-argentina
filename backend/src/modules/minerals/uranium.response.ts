import { ApiProperty } from '@nestjs/swagger';

export class UraniumControllerDto {
  @ApiProperty({ example: 'Blue Sky Uranium Corp.' }) name!: string;
  @ApiProperty({ example: '1.0', nullable: true }) ownership_pct!: string | null;
  @ApiProperty({ example: 'Canadá' }) origin_country!: string;
}

export class UraniumProjectDto {
  @ApiProperty({ example: 'Cerro Solo' }) name!: string;
  @ApiProperty({ example: -43.37, nullable: true }) latitude!: number | null;
  @ApiProperty({ example: -68.688, nullable: true }) longitude!: number | null;
  @ApiProperty({ example: 'Chubut', nullable: true }) province!: string | null;
  @ApiProperty({ example: 'CT', nullable: true }) province_code!: string | null;
  @ApiProperty({ example: 'advanced_exploration', nullable: true }) status!: string | null;
  @ApiProperty({ example: 'Exploración avanzada', nullable: true }) status_label!: string | null;
  @ApiProperty({ example: 'Uranio' }) mineral!: string;
  @ApiProperty({ type: [UraniumControllerDto] }) controllers!: UraniumControllerDto[];
}

export class UraniumProjectsResponseDto {
  @ApiProperty({ example: 21 }) count!: number;
  @ApiProperty({ type: [UraniumProjectDto] }) projects!: UraniumProjectDto[];
}

export class UraniumPriceDto {
  @ApiProperty({ example: '2026-04-01' }) date!: string;
  @ApiProperty({ example: 86.35 }) price_usd!: number;
  @ApiProperty({ example: 'USD/lb' }) unit!: string;
  @ApiProperty({ example: 2026, nullable: true }) year!: number | null;
  @ApiProperty({ example: 4, nullable: true }) month!: number | null;
  @ApiProperty({ example: 'siacam' }) source!: string;
}

export class UraniumPricesResponseDto {
  @ApiProperty({ example: 436 }) count!: number;
  @ApiProperty({ type: [UraniumPriceDto] }) prices!: UraniumPriceDto[];
}

export class UraniumPriceExtremeDto {
  @ApiProperty({ example: 136.22 }) value!: number;
  @ApiProperty({ example: '2007-06-01' }) date!: string;
}

export class UraniumPriceStatsDto {
  @ApiProperty({ example: 86.35, nullable: true }) current!: number | null;
  @ApiProperty({ example: '2026-04-01', nullable: true }) current_date!: string | null;
  @ApiProperty({ type: UraniumPriceExtremeDto, nullable: true }) allTimeHigh!: UraniumPriceExtremeDto | null;
  @ApiProperty({ type: UraniumPriceExtremeDto, nullable: true }) allTimeLow!: UraniumPriceExtremeDto | null;
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
    example: { '1990s': 10.6, '2000s': 34.17, '2010s': 35.9, '2020s': 55.94 },
  })
  decadeAverages!: Record<string, number>;
  @ApiProperty({ example: 'USD/lb' }) unit!: string;
  @ApiProperty({ example: 436 }) total_data_points!: number;
}

export class UraniumTradeRowDto {
  @ApiProperty({ example: 1995 }) year!: number;
  @ApiProperty({ example: 1 }) month!: number;
  @ApiProperty({ example: 'import' }) trade_type!: string;
  @ApiProperty({ example: 'Canada' }) country!: string;
  @ApiProperty({ example: 29747.0 }) value_usd!: number;
  @ApiProperty({ example: 'siacam' }) source!: string;
}

export class UraniumTradeResponseDto {
  @ApiProperty({ type: [UraniumTradeRowDto] }) imports!: UraniumTradeRowDto[];
  @ApiProperty({ type: [UraniumTradeRowDto] }) exports!: UraniumTradeRowDto[];
}

export class UraniumSummaryDto {
  @ApiProperty({ example: 86.35, nullable: true }) currentPrice!: number | null;
  @ApiProperty({ example: '2026-04-01', nullable: true }) currentDate!: string | null;
  @ApiProperty({ example: 2.49, nullable: true }) priceChangePct!: number | null;
  @ApiProperty({ example: 33650, nullable: true }) totalResources!: number | null;
  @ApiProperty({ example: 2600, nullable: true }) historicalProduction!: number | null;
  @ApiProperty({ example: 21 }) activeProjects!: number;
  @ApiProperty({ example: 6 }) provincesWithProjects!: number;
  @ApiProperty({ example: 8 }) advancedProjects!: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
    example: { 'Exploración avanzada': 4, 'Exploración inicial': 7, Prospección: 6, Factibilidad: 2, 'Evaluación Económica Preliminar': 2 },
  })
  projectsByStatus!: Record<string, number>;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
    example: { 'Río Negro': 5, Chubut: 8, Neuquén: 2, Mendoza: 3, Salta: 1, 'Santa Cruz': 2 },
  })
  projectsByProvince!: Record<string, number>;

  @ApiProperty({ type: UraniumPriceStatsDto })
  priceStats!: UraniumPriceStatsDto;
}
