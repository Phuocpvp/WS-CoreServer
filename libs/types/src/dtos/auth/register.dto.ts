import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDTO {
   @IsString()
   @IsNotEmpty()
   username: string;

   @IsEmail()
   @IsNotEmpty()
   email: string;

   @IsString()
   @IsNotEmpty()
   @MinLength(6)
   password: string;
}
