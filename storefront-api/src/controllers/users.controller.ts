import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import UserModel from '../models/user.model';

const userModel = new UserModel();

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.index();
    res.json({
      status: 'success',
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (err) {
    next(err);
  }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.show(parseInt(req.params.id));
    res.json({
      status: 'success',
      message: 'User retrieved successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdUser = await userModel.create(req.body);
    res.json({
      status: 'success',
      message: 'User created successfully',
      data: { ...createdUser }
    });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await userModel.update(req.body);
    res.json({
      status: 'success',
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const removedUser = await userModel.remove(parseInt(req.params.id));
    res.json({
      status: 'success',
      message: 'User removed successfully',
      data: removedUser
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.login(username, password);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'The username and password do not match'
      });
    }

    const token = jwt.sign({ username }, config.token as string);
    res.json({
      status: 'success',
      message: 'User logged in successfully',
      data: { token, ...user }
    });
  } catch (err) {
    next(err);
  }
};
