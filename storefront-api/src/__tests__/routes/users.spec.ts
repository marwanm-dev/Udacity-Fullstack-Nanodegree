import supertest from 'supertest';
import db from '../../database';
import { IUser } from '../../interfaces/user.interface';
import UserModel from '../../models/user.model';
import app from '../../server';

const request = supertest(app);
const userModel = new UserModel();
const baseUrl = '/api/users';
let token = '';

describe('user.model - Endpoints', () => {
  // Mocked data
  const user = {
    username: 'maro',
    firstname: 'marwan',
    lastname: 'mostafa',
    password: 'maro123'
  } as IUser;

  beforeAll(async () => {
    const { id } = await userModel.create(user);
    user.id = id;
  });

  afterAll(async () => {
    const connection = await db.connect();
    const sql = 'DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await connection.query(sql);

    connection.release();
  });

  describe('Authentication', () => {
    it('should POST /login successfully', async () => {
      const response = await request.post(`${baseUrl}/login`).send({
        username: 'maro',
        password: 'maro123'
      });
      const { id, username, firstname, lastname, token: userToken } = response.body.data;

      expect(response.status).toBe(200);
      expect(id).toBe(user.id);
      expect(username).toBe('maro');
      expect(firstname).toBe('marwan');
      expect(lastname).toBe('mostafa');

      token = userToken; // Setting our token for further testing
    });

    it('should fail to POST /login successfully', async () => {
      const response = await request.post(`${baseUrl}/login`).send({
        username: 'maroo',
        password: 'maro123'
      });
      expect(response.status).toBe(401);
    });
  });

  describe('Model methods', () => {
    it('should POST to /users sucessfully', async () => {
      const response = await request
        .post(baseUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'maro',
          firstname: 'marwan',
          lastname: 'mostafa',
          password: 'maro123'
        } as IUser);
      const { username, firstname, lastname } = response.body.data;

      expect(response.status).toBe(200);
      expect(username).toBe('maro');
      expect(firstname).toBe('marwan');
      expect(lastname).toBe('mostafa');
    });

    it('should GET /users sucessfully', async () => {
      const response = await request.get(baseUrl).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('should GET /users/:id sucessfully', async () => {
      const response = await request
        .get(`${baseUrl}/${user.id}`)
        .set('Authorization', `Bearer ${token}`);
      const { username } = response.body.data;

      expect(response.status).toBe(200);
      expect(username).toBe('maro');
    });

    it('should PUT to /users/:id sucessfully', async () => {
      const response = await request
        .put(`${baseUrl}/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...user,
          username: 'moza',
          firstname: 'mazen',
          lastname: 'mostafa'
        });
      const { id, username, firstname, lastname } = response.body.data;

      expect(response.status).toBe(200);
      expect(id).toBe(user.id);
      expect(username).toBe('moza');
      expect(firstname).toBe('mazen');
      expect(lastname).toBe('mostafa');
    });

    it('should DELETE /users/:id sucessfully', async () => {
      const response = await request
        .delete(`${baseUrl}/${user.id}`)
        .set('Authorization', `Bearer ${token}`);
      const { id, username } = response.body.data;

      expect(response.status).toBe(200);
      expect(id).toBe(user.id);
      expect(username).toBe('moza');
    });
  });
});
