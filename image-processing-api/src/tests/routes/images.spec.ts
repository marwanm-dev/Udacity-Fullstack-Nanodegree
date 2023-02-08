import supertest from 'supertest';
import app from '../../index';

const request = supertest(app);

describe('images.ts - Test endpoint responses', () => {
  // Due to an error for the incompleteness within 5000ms
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;
  });

  describe('/ endpoint', () => {
    it('should send images.html', async () => {
      const response = await request.get('/api/images');

      expect(response.type).toBe('text/html');
    });

    it('should send image.specified_format if exists if not specified should defaults to jpeg', async () => {
      const filename = 'fjord';
      const format = 'png';
      const width = 200;
      const height = 200;
      const specifiedFormatResponse = await request.get(
        `/api/images?filename=${filename}&format=${format}&full=true`
      );

      expect(specifiedFormatResponse.type).toBe(`image/${format}`);

      const jpegResponse = await request.get(
        `/api/images?filename=${filename}&width=${width}&height=${height}`
      );
      expect(jpegResponse.type).toBe(`image/jpeg`);
    });
  });

  describe('/all endpoint', () => {
    it('should send all images successfully', async () => {
      const response = await request.get('/api/images/all');
      expect(response.status).toBe(200);
    });
  });

  describe('/new endpoint', () => {
    it('should upload the image successfully', () => {
      request
        .post('/api/images/new')
        .then(res => {
          console.log(res);
          expect(res.status).toBe(201);
        })
        .catch(err => console.log(err));
    });
  });
});
