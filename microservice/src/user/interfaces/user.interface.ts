export interface UserService {
  findAll(filter: object): Promise<User[]>;
}

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
}

export interface UserList {
  users: User[];
}
