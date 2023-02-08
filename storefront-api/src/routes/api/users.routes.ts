import { Router } from 'express';
import { create, index, login, remove, show, update } from '../../controllers/users.controller';
import verifyJWT from '../../middleware/verifyJWT';

const routes = Router();

routes.route('/').get(verifyJWT, index).post(create);

routes.route('/:id').get(verifyJWT, show).put(verifyJWT, update).delete(verifyJWT, remove);

routes.post('/login', login);

export default routes;
