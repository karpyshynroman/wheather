import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @Transform(({ value }) => String(value ?? '').trim().toLowerCase())
  @IsEmail()
  email: string;

  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  @MinLength(8)
  password: string;
}
