import { MessagingService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WidgetService {
   constructor(private readonly messagingService: MessagingService) {}

   async onModuleInit() {
      this.messagingService.subscribeToResponseOf('widget.create.widget');
      this.messagingService.subscribeToResponseOf('widget.findAll.widgets');
      this.messagingService.subscribeToResponseOf('widget.findOne.widget');
      this.messagingService.subscribeToResponseOf('widget.update.widget');
      this.messagingService.subscribeToResponseOf('widget.remove.widget');
   }
}
