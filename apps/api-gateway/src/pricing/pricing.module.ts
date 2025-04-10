import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { MessagingModule } from '@app/common';

@Module({
  imports:[MessagingModule],
  controllers: [PricingController],
  providers: [PricingService],
})
export class PricingModule {}
