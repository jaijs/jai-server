const request = require('supertest');
const JaiServer = require('../dist/index');
const path = require('path');
const http = require('http');
describe('Jai Server', () => {
  let app;
  let server;

  beforeEach((done) => {

    try {
      app = new JaiServer({
        static: {
          dir: path.join(__dirname, 'public')
        }
      });
      const randomPort = Math.floor(Math.random() * 1000) + 1111;
      server = http.createServer(app).listen(randomPort,()=>{
        done()
      });

    } catch (e) {
      console.error("Error starting server:", e);
      throw e;
    }
  });

  afterEach((done) => {
    server.close(() => {
        done();
      })
  });


  describe('Response Methods', () => {
    test('res.send() should send a text response', async () => {
      app.get('/hello', (req, res) => {
        res.send('Hello, World!');
      });

      const response = await request(app).get('/hello');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!');
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });

    test('res.json() should send a JSON response', async () => {
      app.get('/user', (req, res) => {
        res.json({ id: 1, name: 'John Doe' });
      });

      const response = await request(app).get('/user');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, name: 'John Doe' });
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('res.redirect() should redirect to a new URL', async () => {
      app.get('/old-route', (req, res) => {
        res.redirect('/new-route');
      });

      const response = await request(app).get('/old-route');
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/new-route');
    });

    test('res.status() should set the HTTP status code', async () => {
      app.get('/error', (req, res) => {
        res.status(404).send('Page Not Found');
      });

      const response = await request(app).get('/error');
      expect(response.status).toBe(404);
      expect(response.text).toBe('Page Not Found');
    });

    test('res.header() should set custom headers', async () => {
      app.get('/custom-header', (req, res) => {
        res.header('X-Custom-Header', 'MyValue').send('Header set!');
      });

      const response = await request(app).get('/custom-header');
      expect(response.status).toBe(200);
      expect(response.headers['x-custom-header']).toBe('MyValue');
      expect(response.text).toBe('Header set!');
    });
  });

  describe('Middleware and Routers', () => {
    test('Middleware should be executed', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      
      app.use((req, res, next) => {
        console.log('Middleware executed');
        next();
      });

      app.get('/test-middleware', (req, res) => {
        res.send('Test');
      });

      await request(app).get('/test-middleware');
      expect(consoleSpy).toHaveBeenCalledWith('Middleware executed');
      consoleSpy.mockRestore();
    });

    test('Router should handle routes', async () => {
      const router = JaiServer.Router();

      router.get('/hello', (req, res) => {
        res.send('Hello from the router!');
      });

      app.use('/api', router);

      const response = await request(app).get('/api/hello');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello from the router!');
    });
  });
});