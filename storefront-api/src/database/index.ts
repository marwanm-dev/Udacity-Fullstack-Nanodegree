import { Pool } from 'pg';
import config from '../config';

const db = new Pool({
  host: config.host,
  database: config.database,
  user: config.user,
  password: config.password
});

db.on('error', (error: Error) => {
  console.error(`Error: ${error.message}`); // eslint-disable-line
});

export default db;
