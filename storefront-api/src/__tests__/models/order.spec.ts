import db from '../../database';
import { IOrder, IOrderReturn } from '../../interfaces/order.interface';
import { IOrderProducts, IOrderProductsReturn } from '../../interfaces/orderProducts.interface';
import { IProduct } from '../../interfaces/product.interface';
import { IUser } from '../../interfaces/user.interface';
import OrderModel from '../../models/order.model';
import ProductModel from '../../models/product.model';
import UserModel from '../../models/user.model';

const orderModel = new OrderModel();
const productModel = new ProductModel();
const userModel = new UserModel();

describe('order.model - Infrastructure', () => {
  // Mocked data
  const user = {
    id: 1,
    username: 'maro',
    firstname: 'marwan',
    lastname: 'mostafa',
    password: 'maro123'
  } as IUser;
  const product = { id: 1, name: 'milk', price: 200 } as IProduct;
  const order = {
    id: 1,
    status: 'active',
    user_id: 1
  } as IOrder;

  beforeAll(async () => {
    await productModel.create(product);
    await userModel.create(user);
  });

  afterAll(async () => {
    const conn = await db.connect();
    const sql =
      'DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;delete FROM products;ALTER SEQUENCE products_id_seq RESTART WITH 1;DELETE FROM orders;ALTER SEQUENCE orders_id_seq RESTART WITH 1;DELETE FROM order_products;ALTER SEQUENCE order_products_id_seq RESTART WITH 1;';
    await conn.query(sql);

    conn.release();
  });

  describe('Methods', () => {
    it('should have all methods defined', () => {
      expect(orderModel.index).toBeDefined();
      expect(orderModel.showActiveOrders).toBeDefined();
      expect(orderModel.showCurrentOrder).toBeDefined();
      expect(orderModel.updateOrderStatus).toBeDefined();
      expect(orderModel.create).toBeDefined();
      expect(orderModel.remove).toBeDefined();
      expect(orderModel.addProduct).toBeDefined();
    });
  });

  describe('Logic', () => {
    it('create method should return a new order', async () => {
      const { id, status, user_id } = await orderModel.create({
        status: 'active',
        user_id: 1
      } as IOrder);
      expect(id).toBe(1);
      expect(status).toBe('active');
      expect(parseInt(String(user_id))).toBe(1);
    });

    it('addProduct method should add new product to the order', async () => {
      const { id, quantity, order_id, product_id } = await orderModel.addProduct({
        product_id: 1,
        order_id: 1
      } as IOrderProducts);

      expect(parseInt(String(id))).toBe(2);
      expect(parseInt(String(quantity))).toBe(1);
      expect(parseInt(String(order_id))).toBe(1);
      expect(parseInt(String(product_id))).toBe(1);
    });

    it('index method should return list of all orders of a specific user', async () => {
      await orderModel.create({
        status: 'active',
        user_id: user.id
      } as IOrder);

      const orders = await orderModel.index(user.id as number);

      expect(orders.length).toBe(2);
    });

    it('updateOrderStatus method should return an order with edited status', async () => {
      const updatedOrder = await orderModel.updateOrderStatus(order.id as number, 'complete');
      const { id, status } = updatedOrder;
      expect(id).toBe(order.id as number);
      expect(status).toBe('complete');
    });

    it('showCurrentOrder method should return latest order when called with the user id', async () => {
      const foundOrder = await orderModel.showCurrentOrder(user.id as number);
      const { id, status, user_id } = foundOrder;

      expect(id).toBe(2);
      expect(status).toBe(order.status);
      expect(parseInt(String(user_id))).toBe(order.user_id);
    });

    it('showActiveOrders method should return orders that have a completed status when called with the user id', async () => {
      const foundOrders = await orderModel.showActiveOrders(user.id as number);

      expect(foundOrders.length).toBe(1);
    });

    it('remove method should delete a order with his id', async () => {
      const deletedOrder = await orderModel.remove(order.id as number);

      expect(deletedOrder.id).toBe(order.id as number);
    });
  });
});
