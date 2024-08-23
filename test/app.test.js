// app.test.js
const http = require('http');
const app = require('./app');
const axios = require('axios');

describe('Custom Express-like App', () => {
  let server;
  let baseURL;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const { port } = server.address();
      baseURL = `http://localhost:${port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('Root route', () => {
    it('should return welcome message', async () => {
      const response = await axios.get(`${baseURL}/`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'Welcome to the root route!' });
    });
  });

  describe('User routes (with router)', () => {
    it('should get all users', async () => {
      const response = await axios.get(`${baseURL}/users`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'Get all users' });
    });

    it('should get a specific user', async () => {
      const response = await axios.get(`${baseURL}/users/123`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'Get user with id 123' });
    });

    it('should create a new user', async () => {
      const response = await axios.post(`${baseURL}/users`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'Create a new user' });
    });
  });

  describe('Product routes (without router)', () => {
    it('should get all products', async () => {
      const response = await axios.get(`${baseURL}/products`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'Get all products' });
    });

    it('should get a specific product', async () => {
      const response = await axios.get(`${baseURL}/products/456`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'Get product with id 456' });
    });

    it('should create a new product', async () => {
      const response = await axios.post(`${baseURL}/products`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'Create a new product' });
    });
  });

  describe('Error handling', () => {
    it('should return 404 for non-existent route', async () => {
      try {
        await axios.get(`${baseURL}/non-existent`);
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toEqual({ message: 'Not Found' });
      }
    });

    it('should handle errors', async () => {
      // Add a route that throws an error
      app.get('/error', () => {
        throw new Error('Test error');
      });

      try {
        await axios.get(`${baseURL}/error`);
      } catch (error) {
        expect(error.response.status).toBe(500);
        expect(error.response.data).toEqual({ message: 'Something went wrong!' });
      }
    });
  });
});