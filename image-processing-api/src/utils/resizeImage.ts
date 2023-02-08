import sharp from 'sharp';

interface IResizeImage {
  fullPath: string;
  thumbPath: string;
  width: number | undefined;
  height: number | undefined;
}

async function resizeImage({ fullPath, thumbPath, width, height }: IResizeImage): Promise<boolean> {
  if (width && height)
    try {
      await sharp(fullPath).resize({ width, height }).toFile(thumbPath);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  return false;
}

export default resizeImage;
