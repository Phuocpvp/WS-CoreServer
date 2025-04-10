import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MessagingService } from '@app/common';
import { LoginDTO, RegisterDTO } from '@app/types';
import { AuthGuard } from '@nestjs/passport';

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

   @Post('refresh-token')
   @UseGuards(AuthGuard('jwt-refresh'))
   RefreshToken(@Req() req) {
      return this.messagingService.send('auth.refresh-token', req.user);
   }
}
