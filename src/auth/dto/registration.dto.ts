import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegistrationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
