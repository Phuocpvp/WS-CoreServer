import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { Pricing, PricingSchema } from './schemas/pricing.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
   imports: [
      MongooseModule.forFeature([
         { name: Pricing.name, schema: PricingSchema },
      ]),
   ],
   controllers: [PricingController],
   providers: [PricingService],
})
export class PricingModule {}
