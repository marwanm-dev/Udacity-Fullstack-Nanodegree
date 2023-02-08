import { Router } from 'express';
import {
  addProduct,
  create,
  index,
  remove,
  showActiveOrders,
  showCurrentOrder,
  updateOrderStatus
} from '../../controllers/orders.controller';
import verifyJWT from '../../middleware/verifyJWT';

const routes = Router();

routes.route('/').post(verifyJWT, create);

routes.route('/:user_id').get(verifyJWT, index);

routes.route('/current/:user_id').get(verifyJWT, showCurrentOrder);

routes.route('/active/:user_id').get(verifyJWT, showActiveOrders);

routes.route('/:id').delete(verifyJWT, remove).put(verifyJWT, updateOrderStatus);

routes.route('/:id/products').post(verifyJWT, addProduct);

export default routes;
