import db from '../../database';
import { IUser, IUserReturn } from '../../interfaces/user.interface';
import UserModel from '../../models/user.model';

const userModel = new UserModel();

describe('user.model - Infrastructure', () => {
  // Mocked data
  const user = {
    username: 'maro',
    firstname: 'marwan',
    lastname: 'mostafa',
    password: 'maro123'
  } as IUser;

  beforeAll(async () => {
    const { id } = await userModel.create(user as IUser);
    user.id = id;
  });

  afterAll(async () => {
    const connection = await db.connect();
    const sql = 'DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await connection.query(sql);

    connection.release();
  });

  describe('Methods', () => {
    it('should have all methods defined', () => {
      expect(userModel.index).toBeDefined();
      expect(userModel.show).toBeDefined();
      expect(userModel.create).toBeDefined();
      expect(userModel.update).toBeDefined();
      expect(userModel.remove).toBeDefined();
      expect(userModel.login).toBeDefined();
    });
  });

  describe('Logic', () => {
    it('create method should return a new user', async () => {
      const createdUser = await userModel.create({
        username: 'maro2',
        firstname: 'marwan2',
        lastname: 'mostafa2',
        password: 'maro123'
      } as IUser);

      expect(createdUser).toEqual({
        id: createdUser.id,
        username: 'maro2',
        firstname: 'marwan2',
        lastname: 'mostafa2'
      } as IUserReturn);
    });

    it('index method should return list of all users', async () => {
      await userModel.create({
        username: 'maro3',
        firstname: 'marwan3',
        lastname: 'mostafa3',
        password: 'maro123'
      } as IUser);
      const users = await userModel.index();

      expect(users.length).toBe(3);
    });

    it('show method should return maro when called with his id', async () => {
      const foundUser = await userModel.show(user.id as number);

      expect(foundUser.id).toBe(user.id as number);
      expect(foundUser.username).toBe(user.username);
      expect(foundUser.firstname).toBe(user.firstname);
      expect(foundUser.lastname).toBe(user.lastname);
    });

    it('update method should return a user with edited properties', async () => {
      const updatedUser = await userModel.update({
        ...user,
        username: 'moza',
        firstname: 'mazen',
        lastname: 'mostafa'
      });

      expect(updatedUser.id).toBe(user.id as number);
      expect(updatedUser.username).toBe('moza');
      expect(updatedUser.firstname).toBe('mazen');
      expect(updatedUser.lastname).toBe('mostafa');
    });

    it('remove method should delete a user with his id', async () => {
      const deletedUser = await userModel.remove(user.id as number);

      expect(deletedUser.id).toBe(user.id as number);
    });
  });
});
