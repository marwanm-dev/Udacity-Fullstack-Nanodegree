import db from '../../database';
import { IProduct, IProductReturn } from '../../interfaces/product.interface';
import ProductModel from '../../models/product.model';

const productModel = new ProductModel();

describe('product.model - Infrastructure', () => {
  // Mocked data
  const product = {
    name: 'milk',
    price: 200
  } as IProduct;

  beforeAll(async () => {
    const { id } = await productModel.create(product);
    product.id = id;
  });

  afterAll(async () => {
    const connection = await db.connect();
    const sql = 'DELETE FROM products;ALTER SEQUENCE products_id_seq RESTART WITH 1;';
    await connection.query(sql);

    connection.release();
  });

  describe('Methods', () => {
    it('should have all methods defined', () => {
      expect(productModel.index).toBeDefined();
      expect(productModel.show).toBeDefined();
      expect(productModel.create).toBeDefined();
      expect(productModel.remove).toBeDefined();
    });
  });

  describe('Logic', () => {
    it('create method should return a new product', async () => {
      const createdProduct = await productModel.create({
        name: 'milk2',
        price: 250
      } as IProduct);

      expect(createdProduct).toEqual({
        id: createdProduct.id,
        name: 'milk2',
        price: 250
      } as IProductReturn);
    });

    it('index method should return list of all products', async () => {
      await productModel.create({
        name: 'milk3',
        price: 350
      } as IProduct);
      const products = await productModel.index();

      expect(products.length).toBe(3);
    });

    it('show method should return maro when called with his id', async () => {
      const foundProduct = await productModel.show(product.id as number);

      expect(foundProduct.id).toBe(product.id as number);
      expect(foundProduct.name).toBe(product.name);
      expect(foundProduct.price).toBe(product.price);
    });

    it('remove method should delete a product with his id', async () => {
      const deletedProduct = await productModel.remove(product.id as number);

      expect(deletedProduct.id).toBe(product.id as number);
    });
  });
});
