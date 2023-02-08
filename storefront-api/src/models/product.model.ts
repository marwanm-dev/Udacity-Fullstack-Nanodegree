import db from '../database';
import Error from '../interfaces/error';
import { IProduct, IProductReturn } from '../interfaces/product.interface';

class ProductModel {
  async index(): Promise<IProductReturn[]> {
    try {
      const sql = 'SELECT * FROM products';
      const conn = await db.connect();

      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: number): Promise<IProductReturn> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await db.connect();

      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get the product ${id}. Error: ${err}`);
    }
  }

  async create(product: IProduct): Promise<IProductReturn> {
    const { name, price } = product;
    if (!name || !price) {
      throw new Error('Could not create new product due to missing inputs.');
    }

    try {
      const sql = 'INSERT INTO products (name, price) values ($1, $2) RETURNING *';
      const conn = await db.connect();

      const result = await conn.query(sql, [name, price]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create new product. Error: ${(err as Error).message}`);
    }
  }

  async remove(id: number): Promise<IProductReturn> {
    try {
      const sql = `DELETE FROM products WHERE id=$1 RETURNING *`;
      const conn = await db.connect();

      const result = await db.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not remove the product ${id}. Error: ${(err as Error).message}`);
    }
  }
}

export default ProductModel;
