import { Body, Controller, Post } from '@nestjs/common';
import { MessagingService } from '@app/common';
import { LoginDTO, RegisterDTO } from '@app/types';

@Controller('auth')
export class AuthController {
   constructor(private readonly messagingService: MessagingService) {}

   @Post('register')
   Register(@Body() registerDTO: RegisterDTO) {
      return this.messagingService.send('auth.register', registerDTO);
   }

   @Post('login')
   Login(@Body() loginDTO: LoginDTO) {
      return this.messagingService.send('auth.login', loginDTO);
   }
}
