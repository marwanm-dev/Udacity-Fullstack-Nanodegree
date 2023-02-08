import { constants, promises as fs } from 'fs';
// You can see that for access I use fspromises .access and for the constants fs.constants.F_OK
const fileExists = async (file: string): Promise<boolean> => {
  return await fs
    .access(file, constants.F_OK)
    .then(() => true)
    .catch(() => false);
};
export default fileExists;
