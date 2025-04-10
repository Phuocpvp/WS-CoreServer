import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDTO, RefreshAccessTokenDTO, RegisterDTO } from '@app/types';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @MessagePattern('auth.register')
   async RegisterAccount(@Payload() registerDTO: RegisterDTO) {
      return await this.authService.Register(registerDTO);
   }

   @MessagePattern('auth.login')
   async LoginAccount(@Payload() loginDTO: LoginDTO) {
      return await this.authService.Login(loginDTO);
   }

   @MessagePattern('auth.refresh-token')
   async RefreshToken(@Payload() refreshaccesstokenDTO: RefreshAccessTokenDTO) {
      return await this.authService.RefreshAccessToken(refreshaccesstokenDTO);
   }
}
