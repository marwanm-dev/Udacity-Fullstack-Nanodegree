import express, { Request, Response } from 'express';
import path from 'path';
import imagesRoute from './images';

const routes = express.Router();

routes.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'));
});

routes.use('/api/images', imagesRoute);

export default routes;
