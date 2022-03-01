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
      const user = await this.userService.create(body).toPromise();
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
    return await this.userService.findAll({}).toPromise();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.userService.findOne({ id: +id }).toPromise();
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
      return await this.userService
        .update({ id: +id, ...updateUserDto })
        .toPromise();
    } catch (e) {
      if (e.code === 5) {
        throw new NotFoundException();
      }
      throw new HttpException(e.details, 500);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    try {
      return await this.userService.remove({ id: +id }).toPromise();
    } catch (e) {
      if (e.code === 5) {
        throw new NotFoundException();
      }
      throw new HttpException(e.details, 500);
    }
  }
}
