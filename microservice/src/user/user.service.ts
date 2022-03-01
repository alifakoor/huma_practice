import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(body: CreateUserDto): Promise<User> {
    const newUser: User = this.userRepo.create({
      username: body.username,
      firstname: body.firstname,
      lastname: body.lastname,
      password: body.password,
      email: body.email,
    });

    return await this.userRepo.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepo.findOne({ where: { username } });
  }

  async update(user: User, body: UpdateUserDto) {
    const { username, firstname, lastname, password, email } = body;

    if (username) user.username = username;
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (password) user.password = password;
    if (email) user.email = email;

    await this.userRepo.save(user);

    return user;
  }

  async remove(user: User) {
    return await this.userRepo.delete(user);
  }
}
