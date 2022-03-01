import { Observable } from 'rxjs';
import { CreateUserDto } from '../dto/create-user.dto';

export interface UserService {
  create(data: CreateUserDto): Observable<User>;
  findAll(filter: object): Observable<UserList>;
  findOne(id: UserId): Observable<User>;
  update({ id: number, ...UpdateUserDto }): Observable<User>;
  remove({ id: number }): Observable<boolean>;
}

export interface UserId {
  id: number;
}

export interface UserList {
  users: User[];
}

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
}
