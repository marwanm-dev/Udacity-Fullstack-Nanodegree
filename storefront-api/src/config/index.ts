import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DEV, DB_TEST, ENV, SALT, PEPPER, TOKEN } = process.env;

export default {
  host: DB_HOST,
  database: ENV === 'dev' ? DB_DEV : DB_TEST,
  user: DB_USER,
  password: DB_PASSWORD,
  pepper: PEPPER,
  salt: SALT,
  token: TOKEN
};
