import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(8)
  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
