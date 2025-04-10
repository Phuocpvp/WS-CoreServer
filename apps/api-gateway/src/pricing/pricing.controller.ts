import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Delete,
   UseGuards,
   Query,
   Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePricingDTO, QueryPricingDTO, UpdatePricingDTO } from '@app/types';
import { MessagingService } from '@app/common';

@Controller('pricing')
@UseGuards(AuthGuard('jwt'))
export class PricingController {
   constructor(private readonly messagingService: MessagingService) {}

   @Post()
   create(@Body() createPricingDTO: CreatePricingDTO) {
      return this.messagingService.send('auth.create.pricing', createPricingDTO);
   }

   @Get()
   findAll(@Query() query: QueryPricingDTO) {
      return this.messagingService.send('auth.findAll.pricing', query);
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.messagingService.send('auth.findOne.pricing', id);
   }

   @Patch(':id')
   update(@Param('id') id: string, @Body() updatePricingDTO: UpdatePricingDTO) {
      return this.messagingService.send('auth.update.pricing', {id, updatePricingDTO});
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.messagingService.send('auth.remove.pricing', id);
   }
}
