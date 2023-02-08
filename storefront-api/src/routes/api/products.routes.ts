import { Router } from 'express';
import { create, index, remove, show } from '../../controllers/products.controller';
import verifyJWT from '../../middleware/verifyJWT';

const routes = Router();

routes.route('/').get(verifyJWT, index).post(verifyJWT, create);

routes.route('/:id').get(verifyJWT, show);

routes.route('/:id').delete(verifyJWT, remove);

export default routes;
