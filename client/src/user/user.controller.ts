import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  OnModuleInit,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserList, UserService } from './interfaces/user.interface';
import { microserviceOptions } from './user.grpc.options';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController implements OnModuleInit {
  @Client(microserviceOptions)
  private microservice: ClientGrpc;

  private userService: UserService;

  onModuleInit() {
    this.userService = this.microservice.getService<UserService>('UserService');
  }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<User> {
    try {
      const user: User = await firstValueFrom(this.userService.create(body));
      return user;
    } catch (e) {
      if (e.code === 6) {
        throw new ConflictException('This username is already taken.');
      }
      throw new HttpException(e.details, 500);
    }
  }

  @Get()
  async findAll(): Promise<UserList> {
    return await firstValueFrom(this.userService.findAll({}));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    try {
      const user: User = await firstValueFrom(
        this.userService.findOne({ id: +id }),
      );
      return user;
    } catch (e) {
      if (e.code === 5) {
        throw new NotFoundException();
      }
      throw new HttpException(e.details, 500);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return await firstValueFrom(
        this.userService.update({ id: +id, ...updateUserDto }),
      );
    } catch (e) {
      switch (e.code) {
        case 5:
          throw new NotFoundException();
        case 6:
          throw new ConflictException('This username is already taken.');
        default:
          throw new HttpException(e.details, 500);
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    try {
      return await firstValueFrom(this.userService.remove({ id: +id }));
    } catch (e) {
      if (e.code === 5) {
        throw new NotFoundException();
      }
      throw new HttpException(e.details, 500);
    }
  }
}
