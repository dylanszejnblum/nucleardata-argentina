import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkEnvelope } from '../../common/swagger';
import {
  UraniumPricesQueryDto,
  UraniumProjectsQueryDto,
  UraniumTradeQueryDto,
} from './uranium.dto';
import {
  UraniumPriceStatsDto,
  UraniumPricesResponseDto,
  UraniumProjectsResponseDto,
  UraniumSummaryDto,
  UraniumTradeResponseDto,
} from './uranium.response';
import { UraniumService } from './uranium.service';

@ApiTags('minerals')
@Controller({ path: 'minerals/uranium', version: '2' })
export class UraniumController {
  constructor(private readonly service: UraniumService) {}

  @Get('projects')
  @ApiOperation({
    summary: 'Uranium projects (SIACAM)',
    description:
      'Argentine uranium projects from SIACAM / CNEA, with controllers, status and coordinates. Filter by `province` and / or normalized `status` slug.',
  })
  @ApiOkEnvelope(UraniumProjectsResponseDto)
  projects(@Query() q: UraniumProjectsQueryDto) {
    return this.service.projects(q);
  }

  @Get('prices')
  @ApiOperation({
    summary: 'Uranium price history (SIACAM)',
    description: 'Monthly U3O8 spot price series (USD/lb), 1990 → present. Supports `from` / `to` date range filtering (YYYY-MM or YYYY-MM-DD).',
  })
  @ApiOkEnvelope(UraniumPricesResponseDto)
  prices(@Query() q: UraniumPricesQueryDto) {
    return this.service.prices(q);
  }

  @Get('prices/stats')
  @ApiOperation({
    summary: 'Uranium price statistics',
    description: 'Current price, all-time high / low, and decade averages computed from the full monthly series.',
  })
  @ApiOkEnvelope(UraniumPriceStatsDto)
  priceStats() {
    return this.service.priceStats();
  }

  @Get('trade')
  @ApiOperation({
    summary: 'Uranium imports & exports (SIACAM)',
    description: 'Monthly uranium trade records split into `imports` and `exports`. Optionally filter by `year`.',
  })
  @ApiOkEnvelope(UraniumTradeResponseDto)
  trade(@Query() q: UraniumTradeQueryDto) {
    return this.service.trade(q);
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Uranium dashboard summary',
    description: 'Combined snapshot: current price, total resources / historical production (CNEA), project breakdowns by status and province, and price statistics.',
  })
  @ApiOkEnvelope(UraniumSummaryDto)
  summary() {
    return this.service.summary();
  }
}
