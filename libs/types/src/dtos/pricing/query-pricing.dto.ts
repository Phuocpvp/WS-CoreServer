import { DurationEnum } from '@app/types/enums/pricing/duration.enum';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryPricingDTO {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(DurationEnum)
  duration?: DurationEnum;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}