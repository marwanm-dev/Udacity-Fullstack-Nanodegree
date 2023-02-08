import cors from 'cors';
import express, { Request, Response } from 'express';
import routes from './routes';

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world.');
});

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Listening on http://localhost:${PORT}`);
});

export default app;
