import path from 'path';
import resizeImage from '../../utils/resizeImage';

// REVIEW: I don't know how to test "fs prmoises", maybe with "spyOn" but I don't know how
it('should resize the image successfully if inputs are valid', async () => {
  const filename = 'fjord';
  let width: number | undefined = 200;
  let height: number | undefined = 200;

  const assetsDir = path.join(__dirname, '..', '..', '..', 'assets');
  const fullPath = path.join(assetsDir, 'full', `${filename}.jpg`);
  let thumbPath = path.join(assetsDir, 'thumb', `${filename}-${width}x${height}.jpg`);

  const isResized = await resizeImage({ fullPath, thumbPath, width, height });
  expect(isResized).toBeTrue();

  width = undefined;
  height = undefined;
  thumbPath = path.join(assetsDir, 'thumb', `${filename}-${width}x${height}.jpg`);

  const isResized2 = await resizeImage({ fullPath, thumbPath, width, height });
  expect(isResized2).toBeFalse();
});
