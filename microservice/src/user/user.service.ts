import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/utils/bcrypt';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(body: CreateUserDto): Promise<User> {
    const password = hashPassword(body.password);
    const newUser: User = this.userRepo.create({
      username: body.username,
      firstname: body.firstname,
      lastname: body.lastname,
      password: password,
      email: body.email,
    });

    return await this.userRepo.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find({ where: { isDeleted: false } });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepo.findOne({ where: { username } });
  }

  async update(id: number, body: UpdateUserDto): Promise<UpdateResult> {
    return await this.userRepo.update(id, body);
  }

  async remove(user: User): Promise<DeleteResult> {
    return await this.userRepo.delete(user);
  }

  async softRemove(id: number): Promise<UpdateResult> {
    return await this.userRepo.update(id, { isDeleted: true });
  }
}
