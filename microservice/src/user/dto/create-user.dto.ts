import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 50)
  @IsString()
  username: string;

  @IsNotEmpty()
  @Length(2, 100)
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @Length(2, 100)
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsEmail()
  @IsString()
  email: string;
}
