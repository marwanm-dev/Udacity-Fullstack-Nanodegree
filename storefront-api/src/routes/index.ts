import express from 'express';
import ordersRoutes from './api/orders.routes';
import productsRoutes from './api/products.routes';
import usersRoutes from './api/users.routes';

const routes = express.Router();

routes.use('/users', usersRoutes);
routes.use('/orders', ordersRoutes);
routes.use('/products', productsRoutes);

export default routes;
