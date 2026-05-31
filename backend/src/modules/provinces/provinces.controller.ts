import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiErrorDto, ApiOkEnvelope } from '../../common/swagger';
import { ListProvincesQueryDto, ProvinceProductionQueryDto } from './provinces.dto';
import {
  ProvinceDetailDto,
  ProvinceExportRowDto,
  ProvinceExportSummaryDto,
  ProvinceListItemDto,
  ProvinceProductionPointDto,
} from './provinces.response';
import { ProvincesService } from './provinces.service';

@ApiTags('provinces')
@Controller({ path: 'provinces', version: '2' })
export class ProvincesController {
  constructor(private readonly service: ProvincesService) {}

  @Get()
  @ApiOperation({
    summary: 'List provinces',
    description: 'Every province with oil & gas or mining activity, with combined project counts and commodities. Filter by `commodity`.',
  })
  @ApiOkEnvelope(ProvinceListItemDto, { isArray: true })
  list(@Query() q: ListProvincesQueryDto) {
    return this.service.list(q);
  }

  @Get('export-summary')
  @ApiOperation({
    summary: 'Province export ranking',
    description: 'All provinces ranked by annual export value across petróleo / gas / minería, plus the national totals.',
  })
  @ApiOkEnvelope(ProvinceExportSummaryDto)
  exportSummary() {
    return this.service.exportSummary();
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Province detail',
    description: 'Unified province profile: live oil & gas production summary, mineral project portfolio, and export profile.',
  })
  @ApiParam({ name: 'slug', example: 'chubut' })
  @ApiOkEnvelope(ProvinceDetailDto)
  @ApiNotFoundResponse({ type: ApiErrorDto, description: 'Province slug not found.' })
  detail(@Param('slug') slug: string) {
    return this.service.detail(slug);
  }

  @Get(':slug/production')
  @ApiOperation({
    summary: 'Province O&G production time series',
    description: 'Monthly oil & gas production for the province (same shape as operator production). Empty for provinces with no O&G activity. Supports `from` / `to`.',
  })
  @ApiParam({ name: 'slug', example: 'neuquen' })
  @ApiOkEnvelope(ProvinceProductionPointDto, { isArray: true })
  @ApiNotFoundResponse({ type: ApiErrorDto, description: 'Province slug not found.' })
  production(@Param('slug') slug: string, @Query() q: ProvinceProductionQueryDto) {
    return this.service.production(slug, q);
  }

  @Get(':slug/exports')
  @ApiOperation({
    summary: 'Province exports by sector',
    description: 'Annual export values for the province, by sector and product.',
  })
  @ApiParam({ name: 'slug', example: 'chubut' })
  @ApiOkEnvelope(ProvinceExportRowDto, { isArray: true })
  @ApiNotFoundResponse({ type: ApiErrorDto, description: 'Province slug not found.' })
  exports(@Param('slug') slug: string) {
    return this.service.exports(slug);
  }
}
