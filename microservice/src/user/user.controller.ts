import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserList } from './interfaces/user.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'create')
  async create(@Payload() payload: CreateUserDto) {
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
  async findOne(@Payload() payload: User) {
    const user = await this.userService.findOne(payload.id);
    if (!user) {
      throw new RpcException({
        code: 5,
        message: 'User not found',
      });
    }

    return user;
  }

  @GrpcMethod('UserService', 'update')
  async update(@Payload() body: UpdateUserDto) {
    const user = await this.userService.findOne(body.id);
    if (!user) {
      throw new RpcException({
        code: 5,
        message: 'User not found',
      });
    }

    return await this.userService.update(user, body);
  }

  @GrpcMethod('UserService', 'remove')
  async remove(@Payload() body: User) {
    const user = await this.userService.findOne(body.id);
    if (!user) {
      throw new RpcException({
        code: 5,
        message: 'User not found',
      });
    }

    return await this.userService.remove(user);
  }
}
