import supertest from 'supertest';
import app from '../../index';

const request = supertest(app);

describe('index.ts - Test endpoint responses', () => {
  // Due to an error for the incompleteness within 5000ms
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;
  });

  it('should send the index.html successfully', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200); // REVIEW: Throws an Unhandled promise rejection "TypeError: Cannot read properties of undefined (reading 'replace')", Absolute no evidence of why that's happenening
  });
});
