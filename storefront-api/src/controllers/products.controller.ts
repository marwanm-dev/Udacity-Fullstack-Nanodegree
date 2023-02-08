import { NextFunction, Request, Response } from 'express';
import ProductModel from '../models/product.model';

const productModel = new ProductModel();

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productModel.index();
    res.json({
      status: 'success',
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (err) {
    next(err);
  }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.show(parseInt(req.params.id));
    res.json({
      status: 'success',
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdProduct = await productModel.create(req.body);
    res.json({
      status: 'success',
      message: 'Product created successfully',
      data: { ...createdProduct }
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const removedProduct = await productModel.remove(parseInt(req.params.id));
    res.json({
      status: 'success',
      message: 'Product removed successfully',
      data: removedProduct
    });
  } catch (err) {
    next(err);
  }
};
