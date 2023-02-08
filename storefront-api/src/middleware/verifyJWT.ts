import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import Error from '../interfaces/error';

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization; // ex: Bearer {token}
  if (!(authHeader as string)?.startsWith('Bearer ')) return res.sendStatus(401);
  const token = (authHeader as string).split(' ')[1];
  try {
    jwt.verify(token, config.token as string);
    next();
  } catch {
    const error: Error = new Error('Login Failed, Try again later');
    error.status = 401;
    next(error);
  }
};

export default verifyJWT;
