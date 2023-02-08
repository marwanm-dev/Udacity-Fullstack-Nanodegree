import { NextFunction, Request, Response } from 'express';
import OrderModel from '../models/order.model';

const orderModel = new OrderModel();

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderModel.index(parseInt(req.params.user_id));
    res.json({
      status: 'success',
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

export const showCurrentOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderModel.showCurrentOrder(parseInt(req.params.user_id));
    res.json({
      status: 'success',
      message: 'Current order retrieved successfully',
      data: order
    });
  } catch (err) {
    next(err);
  }
};

export const showActiveOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderModel.showActiveOrders(parseInt(req.params.user_id));

    res.json({
      status: 'success',
      message: 'Active orders retrieved successfully',
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdOrder = await orderModel.create(req.body);
    res.json({
      status: 'success',
      message: 'Order created successfully',
      data: createdOrder
    });
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  const order_id = parseInt(req.params.id);
  const product_id = parseInt(req.body.product_id);
  const quantity = parseInt(req.body.quantity);

  try {
    const addedProduct = await orderModel.addProduct({ quantity, order_id, product_id });

    res.json({
      status: 'success',
      message: 'Order status updated successfully',
      data: addedProduct
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedOrder = await orderModel.updateOrderStatus(
      parseInt(req.params.id),
      req.body.status
    );

    res.json({
      status: 'success',
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const removedOrder = await orderModel.remove(parseInt(req.params.id));
    res.json({
      status: 'success',
      message: 'Order removed successfully',
      data: removedOrder
    });
  } catch (err) {
    next(err);
  }
};
