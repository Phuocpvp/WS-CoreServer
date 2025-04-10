import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDTO, LoginResponseDTO, RegisterDTO } from '@app/types';

@Injectable()
export class AuthService {
   constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      private readonly jwtservice: JwtService,
      private readonly configService: ConfigService,
   ) {}

   async Register(registerDTO: RegisterDTO): Promise<any> {
      const user = await this.userModel.findOne({
         $or: [
            { username: registerDTO.username },
            { email: registerDTO.email },
         ],
      });

      if (user) {
         const errorMessage =
            user.username === registerDTO.username
               ? 'User with this UserName already exists'
               : 'User with this Email already exists';
         throw new RpcException({
            message: errorMessage,
            statusCode: HttpStatus.CONFLICT,
         });
      }

      if (!registerDTO.username || !registerDTO.password) {
         throw new RpcException({
            message: !registerDTO.username
               ? 'Username is required'
               : 'Password is required',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      } else {
         const HashedPassword = await bcrypt.hash(registerDTO.password, 10);

         await new this.userModel({
            ...registerDTO,
            password: HashedPassword,
         }).save();

         return {
            message: 'User registered successfully',
            data: {
               user: {
                  username: registerDTO.username,
                  email: registerDTO.email,
               },
            },
         };
      }
   }

   GenerateAccessToken(user: User) {
      const payload = {
         username: user.username,
         sub: user._id,
         email: user.email,
      };
      return this.jwtservice.sign(payload, {
         secret: this.configService.get<string>('auth.accessTokenSecret'),
         expiresIn: this.configService.get<string>('auth.accessTokenExpiresIn'),
      });
   }

   GenerateRefreshToken(user: User) {
      const payload = {
         username: user.username,
         sub: user._id,
         email: user.email,
      };
      return this.jwtservice.sign(payload, {
         secret: this.configService.get<string>('auth.refreshTokenSecret'),
         expiresIn: this.configService.get<string>('auth.refreshTokenExpiresIn'),
      });
   }

   async Login(login: LoginDTO): Promise<LoginResponseDTO> {
      const user = await this.userModel.findOne({ username: login.username });
      if (user && (await bcrypt.compare(login.password, user.password))) {
         const AccessToken = this.GenerateAccessToken(user);
         const RefreshToken = this.GenerateRefreshToken(user);

         return {
            message: 'Login successfully',
            data: {
               access_token: AccessToken,
               refresh_token: RefreshToken,
            },
         };
      }
      throw new RpcException({
         message: 'Invalid credentials please try again',
         statusCode: HttpStatus.BAD_REQUEST,
      });
   }
}
