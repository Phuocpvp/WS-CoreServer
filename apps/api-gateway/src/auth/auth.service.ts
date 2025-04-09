import { MessagingService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
   constructor(private readonly messagingService: MessagingService) {}

   async onModuleInit() {
      this.messagingService.subscribeToResponseOf('auth.register');
      this.messagingService.subscribeToResponseOf('auth.login');
   }
}
