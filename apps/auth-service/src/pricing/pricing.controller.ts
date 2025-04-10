import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PricingService } from './pricing.service';
import {
   CreatePricingDTO,
   QueryPricingDTO,
   UpdatePricingDTO,
} from '@app/types';

@Controller()
export class PricingController {
   constructor(private readonly pricingService: PricingService) {}

   @MessagePattern('auth.create.pricing')
   create(@Payload() createPricingDTO: CreatePricingDTO) {
      return this.pricingService.create(createPricingDTO);
   }

   @MessagePattern('auth.findAll.pricing')
   findAll(@Payload() query: QueryPricingDTO) {
      return this.pricingService.findAll(query);
   }

   @MessagePattern('auth.findOne.pricing')
   findOne(@Payload() id: string) {
      return this.pricingService.findOne(id);
   }

   @MessagePattern('auth.update.pricing')
   update(
      @Payload() payload: { id: string; updatePricingDTO: UpdatePricingDTO },
   ) {
      return this.pricingService.update(payload.id, payload.updatePricingDTO);
   }

   @MessagePattern('auth.remove.pricing')
   remove(@Payload() id: string) {
      return this.pricingService.remove(id);
   }
}
