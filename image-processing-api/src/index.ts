import cors from 'cors';
import express from 'express';
import routes from './routes/index';

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

app.use('/', routes);

app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));

export default app;
