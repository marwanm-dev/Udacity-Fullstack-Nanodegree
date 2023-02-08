import path from 'path';
import fileExists from '../../utils/fileExists';

it('should return true if exists', async () => {
  const file = path.join(__dirname, '..', '..', 'assets', 'full', 'fjord.jpg');
  const result = await fileExists(file);
  expect(result).toBeDefined();
});
