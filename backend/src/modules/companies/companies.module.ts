import { Module } from '@nestjs/common';
import { MineralProjectsModule } from '../shared/mineral-projects.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompanyStocksService } from './company-stocks.service';

@Module({
  imports: [MineralProjectsModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompanyStocksService],
})
export class CompaniesModule {}
