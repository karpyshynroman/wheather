import { Transform, Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSearchDto {
  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  @MinLength(2)
  searchQuery: string;

  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  @MinLength(2)
  locationName: string;

  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  @IsIn(['open-meteo', 'wttr'])
  providerId: 'open-meteo' | 'wttr';

  @Transform(({ value }) => String(value ?? '').trim())
  @IsOptional()
  @IsString()
  condition?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  temperatureC?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  feelsLikeC?: number;
}
