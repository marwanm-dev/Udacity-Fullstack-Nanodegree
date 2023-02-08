export interface IUser {
  id?: number;
  username: string;
  firstname: string;
  lastname: string;
  password?: string;
}

export interface IUserReturn {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
}
