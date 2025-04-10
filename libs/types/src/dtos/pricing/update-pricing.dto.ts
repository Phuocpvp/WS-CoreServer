import { DurationEnum } from '@app/types/enums/pricing/duration.enum';
import {
   IsArray,
   IsBoolean,
   IsEnum,
   IsNumber,
   IsOptional,
   IsString,
} from 'class-validator';

export class UpdatePricingDTO {
   @IsOptional()
   @IsArray()
   @IsString({ each: true })
   features?: string[];

   @IsOptional()
   @IsString()
   name?: string;

   @IsOptional()
   @IsString()
   description?: string;

   @IsOptional()
   @IsNumber()
   projectLimit?: number;

   @IsOptional()
   @IsNumber()
   teamLimit?: number;

   @IsOptional()
   @IsBoolean()
   unlimitedProjects?: boolean;

   @IsOptional()
   @IsEnum(DurationEnum)
   duration?: DurationEnum;

   @IsOptional()
   @IsBoolean()
   isDeleted?: boolean;
}
