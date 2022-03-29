export interface UserControllerInterface {
  findAll(): Promise<UserList>;
  create(body: Body): Promise<User>;
  findOne(id: UserId): Promise<User>;
  update(user: User): Promise<UpdateUser>;
  remove(id: UserId): Promise<RemoveUser>;
}

export interface UserId {
  id: number;
}

export interface Body {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
}

export interface User extends UserId, Body {}

export interface UserList {
  users: User[];
}

export interface UpdateUser {
  id: number;
  isUpdated: boolean;
  message: string;
}

export interface RemoveUser {
  id: number;
  isRemoved: boolean;
  message: string;
}
