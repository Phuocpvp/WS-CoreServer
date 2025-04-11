import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MessagingModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../config/jwt.strategy';
import { RefreshTokenStrategy } from '../config/refresh-token.strategy';

@Module({
   imports: [
      MessagingModule,
      JwtModule.registerAsync({
         imports: [ConfigModule],
         useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('auth.accessTokenSecret'),
         }),
         inject: [ConfigService],
      }),
   ],
   providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
   controllers: [AuthController],
})
export class AuthModule {}
