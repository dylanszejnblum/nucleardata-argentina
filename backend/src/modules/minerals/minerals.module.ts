import { Module } from '@nestjs/common';
import { MineralsController } from './minerals.controller';
import { MineralsService } from './minerals.service';
import { PricesService } from './prices.service';
import { UraniumController } from './uranium.controller';
import { UraniumService } from './uranium.service';

@Module({
  controllers: [MineralsController, UraniumController],
  providers: [MineralsService, PricesService, UraniumService],
})
export class MineralsModule {}
