import { MessagingService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingService {
   constructor(private readonly messagingService: MessagingService) {}

   async onModuleInit() {
      this.messagingService.subscribeToResponseOf('auth.create.pricing');
      this.messagingService.subscribeToResponseOf('auth.findAll.pricing');
      this.messagingService.subscribeToResponseOf('auth.findOne.pricing');
      this.messagingService.subscribeToResponseOf('auth.update.pricing');
      this.messagingService.subscribeToResponseOf('auth.remove.pricing');
   }
}
