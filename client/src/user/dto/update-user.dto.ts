import { PartialType } from '@nestjs/mapped-types';
import { IsEmail } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  username?: string;

  firstname?: string;

  lastname?: string;

  password?: string;

  @IsEmail()
  email?: string;
}
