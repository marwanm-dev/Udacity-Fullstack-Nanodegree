import express, { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import fileExists from '../utils/fileExists';
import resizeImage from '../utils/resizeImage';

const images = express.Router();

const assetsDir = path.join(__dirname, '..', '..', 'assets');
const defaultDim = 250;
const defaultFormat = 'jpeg';

images.get('/', async (req: Request, res: Response) => {
  const { filename, width: widthString, height: heightString, format: specifiedFormat, full } = req.query;
  let invalidDims = false;

  if(!widthString || !heightString) invalidDims = true
  
  if (!filename) {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'images.html'));
    return;
  }
  else {
    if(full && !invalidDims) res.end("Sorry, Can't resize image on full image mode.")
    if(!full && invalidDims) res.end('Sorry invalid parameters either turn on full mode or specify width and height.')
  }

  const width = invalidDims ?undefined  : parseInt(String(widthString));
  const height = invalidDims ?  undefined :parseInt(String(heightString));
  const formats = ['png', 'jpeg', 'jpg', 'PNG', 'JPEG', 'JPG'];

  let fullPath = path.join(assetsDir, 'full', `${filename}.${specifiedFormat || defaultFormat}`);
  let thumbPath = path.join(
    assetsDir,
    'thumb',
    `${filename}-${width || defaultDim}x${height || defaultDim}.${specifiedFormat || defaultFormat}`
  );

  if (!(await fileExists(fullPath))) {
    formats.forEach(async format => {
      const file = path.join(assetsDir, 'full', `${filename}.${format}`);
      if (await fileExists(file)) {
        fullPath = file;
      }
    });
  }

  if (!(await fileExists(thumbPath))) {
    formats.forEach(async format => {
      const file = path.join(assetsDir, 'thumb', `${filename}-${width}x${height}.${format}`);
      if (await fileExists(file)) {
        thumbPath = file;
      }
    });
  }

  try {
    await fs.access(thumbPath);
  } catch (error) {
    if (!invalidDims)
      await resizeImage({
        fullPath,
        thumbPath,
        width,
        height,
      });
  } finally {
    res.sendFile(!invalidDims ? thumbPath : fullPath);
  }
});

images.get('/all', async (req: Request, res: Response) => {
  const thumbPath = path.join(assetsDir, 'thumb');
  const fullPath = path.join(assetsDir, 'full');

  res.json({ resized: await fs.readdir(thumbPath), full: await fs.readdir(fullPath) });
});

images.post('/new', async (req: Request, res: Response) => {
  const file = req.body;

  const fullPath = path.join(assetsDir, 'full');

  const base64Data = file.base64.replace(/^data:image\/png;base64,/, '');
  fs.writeFile(path.join(fullPath, file.name), base64Data, 'base64');

  res.status(201);
});

export default images;
