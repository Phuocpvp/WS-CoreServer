import { Injectable, OnModuleInit } from '@nestjs/common';
import { MessagingService } from '@app/common';

@Injectable()
export class ApiGatewayService implements OnModuleInit {
   constructor(
      private readonly messagingService: MessagingService,
   ) {}

   async onModuleInit() {
      this.messagingService.subscribeToResponseOf('auth.health');
      this.messagingService.subscribeToResponseOf('task-manager.health');
      this.messagingService.subscribeToResponseOf('workspace.health');
   }

   getHello(): string {
      return '🚀 API-Gateway is running 🚀';
   }

}
