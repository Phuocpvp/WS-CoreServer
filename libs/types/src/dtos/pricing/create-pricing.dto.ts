import { DurationEnum } from '@app/types/enums/pricing/duration.enum';
import {
   IsArray,
   IsBoolean,
   IsEnum,
   IsNotEmpty,
   IsNumber,
   IsString,
} from 'class-validator';

export class CreatePricingDTO {
   @IsArray()
   @IsString({ each: true })
   @IsNotEmpty()
   features: string[];

   @IsString()
   @IsNotEmpty()
   name: string;

   @IsString()
   @IsNotEmpty()
   description: string;

   @IsNumber()
   @IsNotEmpty()
   projectLimit: number;

   @IsNumber()
   @IsNotEmpty()
   teamLimit: number;

   @IsBoolean()
   @IsNotEmpty()
   unlimitedProjects: boolean;

   @IsEnum(DurationEnum)
   @IsNotEmpty()
   duration: DurationEnum;
}
