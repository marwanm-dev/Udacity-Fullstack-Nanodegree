import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('server.ts - Endpoints', () => {
  it('should GET / successfully', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });
});
