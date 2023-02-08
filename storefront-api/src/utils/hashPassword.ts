import bcrypt from 'bcrypt';
import config from '../config';

const hashPassword = (password: string) =>
  bcrypt.hashSync(`${password}${config.pepper}`, parseInt(config.salt as string, 10));

export default hashPassword;
