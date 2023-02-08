import db from '../database';
import Error from '../interfaces/error';
import { IOrder, IOrderReturn } from '../interfaces/order.interface';
import { IOrderProducts, IOrderProductsReturn } from '../interfaces/orderProducts.interface';

class OrderModel {
  async index(user_id: number): Promise<IOrderReturn[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1)';
      const conn = await db.connect();

      const result = await conn.query(sql, [user_id]);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders for user ${user_id}. Error: ${err}`);
    }
  }

  async showCurrentOrder(user_id: number): Promise<IOrderReturn> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) ORDER BY id DESC LIMIT 1';
      const conn = await db.connect();

      const result = await conn.query(sql, [user_id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not get current order or active orders for user ${user_id}. Error: ${err}`
      );
    }
  }
  async showActiveOrders(user_id: number): Promise<IOrderReturn[]> {
    try {
      const status = 'active';
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      const conn = await db.connect();

      const result = await conn.query(sql, [user_id, status]);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not get current order or active orders for user ${user_id}. Error: ${err}`
      );
    }
  }

  async create(order: IOrder): Promise<IOrderReturn> {
    const { user_id, status } = order;
    if (!user_id || !status) {
      throw new Error('Could not create new order due to missing inputs.');
    }

    try {
      const sql = 'INSERT INTO orders (user_id, status) values ($1, $2) RETURNING *';
      const conn = await db.connect();
      const result = await conn.query(sql, [user_id, status]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create new order. Error: ${(err as Error).message}`);
    }
  }

  async addProduct(OrderProducts: IOrderProducts): Promise<IOrderProductsReturn> {
    const { quantity, order_id, product_id } = OrderProducts;
    if (!order_id || !product_id) {
      throw new Error('Could not add new product to order due to missing inputs.');
    }

    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await db.connect();

      const result = await conn.query(sql, [quantity || 1, order_id, product_id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add product ${product_id} to order ${order_id}: ${err}`);
    }
  }

  async updateOrderStatus(id: number, status: string): Promise<IOrderReturn> {
    try {
      const sql = `UPDATE orders SET status=($2) WHERE id=($1) RETURNING *`;
      const conn = await db.connect();

      const result = await conn.query(sql, [id, status]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update order's status ${id}. Error: ${(err as Error).message}`);
    }
  }

  async remove(id: number): Promise<IOrderReturn> {
    try {
      const sql = `DELETE FROM orders WHERE id=$1 RETURNING *`;
      const conn = await db.connect();

      const result = await db.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not remove the order ${id}. Error: ${(err as Error).message}`);
    }
  }
}

export default OrderModel;
