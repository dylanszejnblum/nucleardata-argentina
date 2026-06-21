import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ResponseMeta } from '../../common/response-meta.decorator';
import { IngestNewsBodyDto, ListNewsQueryDto } from './news.dto';
import { NewsIngestGuard } from './news-ingest.guard';
import { NewsService } from './news.service';

@ApiTags('news')
@ResponseMeta({
  source: 'Editorial, regulatory & corporate sources',
  dataset: 'Vaca Muerta oil & gas news & disclosures',
  license: 'Metadata + snippets; full-text rights remain with each publisher',
  note: 'Each document carries its own source_url, source_family and legal_mode',
})
@Controller({ path: 'news', version: '1' })
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @Post('ingest')
  @UseGuards(NewsIngestGuard)
  @ApiSecurity('news-ingest-token')
  @ApiOperation({
    summary: 'Ingest news documents (internal, token-guarded)',
    description:
      'The data pipeline POSTs batches here. Upserts by doc_id; never overwrites editor notes. Body: { documents: Document[] }.',
  })
  ingest(@Body() body: IngestNewsBodyDto) {
    return this.service.ingest(body.documents);
  }

  @Get()
  @ApiOperation({
    summary: 'List news documents',
    description:
      'Paginated, filterable feed. Sort by importance (default) or recency. ' +
      'Filter by source_family, topic, entity (company/regulator), region, ' +
      'free-text q (title/deck) and a publishedAt from/to window. ' +
      'Returns a card-level projection (no body_text).',
  })
  list(@Query() q: ListNewsQueryDto) {
    return this.service.list(q);
  }

  @Get('facets')
  @ApiOperation({
    summary: 'News filter facets',
    description: 'Distinct topics, source families and top entities with counts, for filter UIs.',
  })
  facets() {
    return this.service.getFacets();
  }

  @Get(':docId')
  @ApiOperation({
    summary: 'Single news document + cluster',
    description: 'Returns the document and its cluster siblings (other docs sharing cluster_id).',
  })
  @ApiParam({ name: 'docId', description: 'Document id (sha1 of canonical source_url)' })
  getOne(@Param('docId') docId: string) {
    return this.service.getOne(docId);
  }
}
