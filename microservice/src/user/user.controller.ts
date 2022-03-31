import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  RemoveUser,
  UpdateUser,
  User,
  UserControllerInterface,
  UserId,
  UserList,
} from './interfaces/user.interface';
import { LoggingInterceptor } from 'src/logger/logger.interceptor';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class UserController implements UserControllerInterface {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'create')
  async create(@Payload() payload: CreateUserDto): Promise<User> {
    const user = await this.userService.findByUsername(payload.username);
    if (user) {
      throw new RpcException({
        code: 6,
        message: 'This username is already taken.',
      });
    }

    return await this.userService.create(payload);
  }

  @GrpcMethod('UserService', 'findAll')
  async findAll(): Promise<UserList> {
    const users = await this.userService.findAll();
    return { users };
  }

  @GrpcMethod('UserService', 'findOne')
  async findOne(@Payload() payload: UserId): Promise<User> {
    const user = await this.userService.findOne(payload.id);
    if (!user || user.isDeleted) {
      throw new RpcException({
        code: 5,
        message: 'User not found',
      });
    }

    return user;
  }

  @GrpcMethod('UserService', 'update')
  async update(@Payload() payload: UpdateUserDto): Promise<UpdateUser> {
    const user = await this.userService.findOne(payload.id);
    if (!user || user.isDeleted) {
      throw new RpcException({
        code: 5,
        message: 'User not found',
      });
    }

    const duplicatedUsername = await this.userService.findByUsername(
      payload.username,
    );
    if (duplicatedUsername) {
      throw new RpcException({
        code: 6,
        message: 'This username is already taken.',
      });
    }

    const updated = await this.userService.update(payload.id, payload);
    if (!updated.affected) {
      throw new RpcException({ code: 3, message: 'Update unsuccessfull!' });
    }
    return {
      id: payload.id,
      isUpdated: true,
      message: 'User updated successfully!',
    };
  }

  @GrpcMethod('UserService', 'remove')
  async remove(@Payload() payload: User): Promise<RemoveUser> {
    const user = await this.userService.findOne(payload.id);
    if (!user || user.isDeleted) {
      throw new RpcException({
        code: 5,
        message: 'User not found',
      });
    }

    const removed = await this.userService.softRemove(user.id);
    if (!removed.affected) {
      throw new RpcException({ code: 3, message: 'Remove unsuccessfull!' });
    }

    return {
      id: payload.id,
      isRemoved: true,
      message: 'User removed successfully!',
    };
  }
}
