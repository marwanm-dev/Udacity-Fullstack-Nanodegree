import bcrypt from 'bcrypt';
import config from '../config';
import db from '../database';
import Error from '../interfaces/error';
import { IUser, IUserReturn } from '../interfaces/user.interface';
import hashPassword from '../utils/hashPassword';

class UserModel {
  async index(): Promise<IUserReturn[]> {
    try {
      const sql = 'SELECT id, username, firstname, lastname FROM users';
      const conn = await db.connect();

      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: number): Promise<IUserReturn> {
    try {
      const sql = 'SELECT id, username, firstname, lastname FROM users WHERE id=($1)';
      const conn = await db.connect();

      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(user: IUser): Promise<IUserReturn> {
    const { username, firstname, lastname, password } = user;
    if (!username || !firstname || !lastname || !password) {
      throw new Error('Could not create new user due to missing inputs.');
    }

    try {
      const sql =
        'INSERT INTO users (username, firstname, lastname, password) values ($1, $2, $3, $4) RETURNING id, username, firstname, lastname';
      const conn = await db.connect();

      const result = await conn.query(sql, [
        username,
        firstname,
        lastname,
        hashPassword(password as string)
      ]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create new user ${username}. Error: ${(err as Error).message}`);
    }
  }

  async update(user: IUser): Promise<IUserReturn> {
    try {
      const sql = `UPDATE users SET username=$1, firstname=$2, lastname=$3, password=$4 WHERE id=$5 RETURNING id, username, firstname, lastname`;
      const conn = await db.connect();

      const result = await conn.query(sql, [
        user.username,
        user.firstname,
        user.lastname,
        hashPassword(user.password as string),
        user.id
      ]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update user ${user.username}. Error: ${(err as Error).message}`);
    }
  }

  async remove(id: number): Promise<IUserReturn> {
    try {
      const sql = `DELETE FROM users WHERE id=($1) RETURNING id, username, firstname, lastname`;
      const conn = await db.connect();

      const result = await db.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not remove the user ${id}. Error: ${(err as Error).message}`);
    }
  }

  async login(username: string, password: string): Promise<IUserReturn | null> {
    try {
      const sql = 'SELECT password FROM users WHERE username=($1)';
      const conn = await db.connect();
      const result = await conn.query(sql, [username]);
      if (result.rows.length) {
        const { password: hashPassword } = result.rows[0];
        const isPasswordsMatch = bcrypt.compareSync(`${password}${config.pepper}`, hashPassword);
        if (isPasswordsMatch) {
          const foundUser = await conn.query(
            'SELECT id, username, firstname, lastname FROM users WHERE username=($1)',
            [username]
          );
          return foundUser.rows[0];
        }
      }
      conn.release();

      return null;
    } catch (error) {
      throw new Error(`Could not login. Error: ${(error as Error).message}`);
    }
  }
}

export default UserModel;
