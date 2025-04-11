import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
   constructor(configService: ConfigService) {
      const secretKey = configService.get<string>('auth.refreshTokenSecret');
      if (!secretKey) {
         throw new Error('REFRESH_TOKEN_SECRET is not defined');
      }
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: false,
         secretOrKey: secretKey,
      });
   }

   async validate(payload: any) {
      return { IDUser: payload.sub, username: payload.username };
   }
}