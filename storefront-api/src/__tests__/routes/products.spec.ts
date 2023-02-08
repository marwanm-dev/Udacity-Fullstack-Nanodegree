import supertest from 'supertest';
import db from '../../database';
import { IProduct } from '../../interfaces/product.interface';
import { IUser } from '../../interfaces/user.interface';
import ProductModel from '../../models/product.model';
import UserModel from '../../models/user.model';
import app from '../../server';

const request = supertest(app);
const productModel = new ProductModel();
const userModel = new UserModel();
const baseUrl = '/api/products';
let token = '';

describe('product.model - Endpoints', () => {
  // Mocked data
  const user = {
    username: 'maro',
    firstname: 'marwan',
    lastname: 'mostafa',
    password: 'maro123'
  } as IUser;
  const product = {
    name: 'milk',
    price: 200
  } as IProduct;

  beforeAll(async () => {
    const { id } = await productModel.create(product);
    product.id = id;

    await userModel.create(user);
    const response = await request.post(`/api/users/login`).send({
      username: 'maro',
      password: 'maro123'
    });

    const { token: userToken } = response.body.data;

    expect(response.status).toBe(200);

    token = userToken; // Setting our token for further testing
  });

  afterAll(async () => {
    const connection = await db.connect();
    const sql =
      'DELETE FROM products;ALTER SEQUENCE products_id_seq RESTART WITH 1;DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await connection.query(sql);

    connection.release();
  });

  describe('Model methods', () => {
    it('should POST to /products sucessfully', async () => {
      const response = await request
        .post(baseUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'milk2',
          price: 250
        } as IProduct);
      const { name, price } = response.body.data;

      expect(response.status).toBe(200);
      expect(name).toBe('milk2');
      expect(price).toBe(250);
    });

    it('should GET /products sucessfully', async () => {
      const response = await request.get(baseUrl).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('should GET /products/:id sucessfully', async () => {
      const response = await request
        .get(`${baseUrl}/${product.id}`)
        .set('Authorization', `Bearer ${token}`);
      const { name } = response.body.data;

      expect(response.status).toBe(200);
      expect(name).toBe('milk');
    });

    it('should DELETE /products/:id sucessfully', async () => {
      const response = await request
        .delete(`${baseUrl}/${product.id}`)
        .set('Authorization', `Bearer ${token}`);
      const { id, name } = response.body.data;

      expect(response.status).toBe(200);
      expect(id).toBe(product.id);
      expect(name).toBe('milk');
    });
  });
});
