import supertest from 'supertest';
import db from '../../database';
import { IOrder } from '../../interfaces/order.interface';
import { IOrderProducts } from '../../interfaces/orderProducts.interface';
import { IProduct } from '../../interfaces/product.interface';
import { IUser } from '../../interfaces/user.interface';
import OrderModel from '../../models/order.model';
import ProductModel from '../../models/product.model';
import UserModel from '../../models/user.model';
import app from '../../server';

const request = supertest(app);
const orderModel = new OrderModel();
const productModel = new ProductModel();
const userModel = new UserModel();
const baseUrl = '/api/orders';
let token = '';

describe('order.model - Endpoints', () => {
  // Mocked data
  const user = {
    id: 1,
    username: 'maro',
    firstname: 'marwan',
    lastname: 'mostafa',
    password: 'maro123'
  } as IUser;
  const product = { id: 1, name: 'milk', price: 200 } as IProduct;
  const order = { id: 1, status: 'active', user_id: 1 } as IOrder;

  beforeAll(async () => {
    await userModel.create(user);
    await productModel.create(product);
    await orderModel.create(order);

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
    const conn = await db.connect();
    const sql =
      'DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;delete FROM products;ALTER SEQUENCE products_id_seq RESTART WITH 1;DELETE FROM orders;ALTER SEQUENCE orders_id_seq RESTART WITH 1;';
    await conn.query(sql);

    conn.release();
  });

  describe('Model methods', () => {
    it('should POST to /orders sucessfully', async () => {
      const response = await request
        .post(baseUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_id: user.id,
          product_id: product.id,
          status: 'active'
        } as IOrder);
      const { user_id, status } = response.body.data;

      expect(response.status).toBe(200);
      expect(parseInt(user_id)).toBe(user.id as number);
      expect(status).toBe('active');
    });

    it('should POST to /orders/:id/products sucessfully', async () => {
      const response = await request
        .post(`${baseUrl}/1/products`)
        .set('Authorization', `Bearer ${token}`)
        .query({ id: 1 })
        .send({
          product_id: 1
        });
      const { quantity, order_id, product_id } = response.body.data;

      expect(response.status).toBe(200);
      expect(parseInt(String(order_id))).toBe(1);
      expect(parseInt(String(product_id))).toBe(product.id as number);
      expect(quantity).toBe(1);
    });

    it('should GET /orders/:user_id sucessfully', async () => {
      const response = await request
        .get(`${baseUrl}/${user.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('should GET /orders/current/:user_id sucessfully', async () => {
      const response = await request
        .get(`${baseUrl}/current/${user.id}`)
        .set('Authorization', `Bearer ${token}`);
      const { id } = response.body.data;

      expect(response.status).toBe(200);
      expect(id).toBe(2);
    });

    it('should GET /orders/active/:user_id sucessfully', async () => {
      const response = await request
        .get(`${baseUrl}/active/${user.id}`)
        .set('Authorization', `Bearer ${token}`);
      const activeOrders = response.body.data;

      expect(response.status).toBe(200);
      expect(activeOrders.length).toBe(2);
    });

    it('should PUT to /orders/:id sucessfully', async () => {
      const obj = {
        status: 'complete'
      };
      const response = await request
        .put(`${baseUrl}/${order.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(obj);
      const { id, status } = response.body.data;

      expect(response.status).toBe(200);
      expect(id).toBe(order.id);
      expect(status).toBe('complete');
    });

    it('should DELETE /orders/:id sucessfully', async () => {
      const response = await request
        .delete(`${baseUrl}/${order.id}`)
        .set('Authorization', `Bearer ${token}`);
      const { id } = response.body.data;

      expect(response.status).toBe(200);
      expect(id).toBe(order.id);
    });
  });
});
