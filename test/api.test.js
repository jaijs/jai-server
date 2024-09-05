const request = require('supertest');
var JaiServer = require('../dist/index');

 const path = require('path');
const exp = require('constants');
describe('Jai-Server Tests', () => {
  let app;
  let server;
  // Mock middleware that always throws an error
  const errorMiddleware = (req, res, next) => {
    throw new Error('Test Error');
  };

  // Mock middleware that sets an error on the request object
  const setErrorMiddleware = (req, res, next) => {
    req.error = new Error('Test error from middleware');
    next(req.error);
  };

  // Mock async middleware that rejects
  const asyncErrorMiddleware = async (req, res, next) => {
    await Promise.reject(new Error('Async error'));
  };

  beforeEach((done) => {
    try {
      app = new JaiServer({
        static:{
          dir: path.join(__dirname,'public')
        }
      });
     

      app.use('/error-middleware', errorMiddleware, (req, res) => res.send('OK'));
      app.use('/set-error', setErrorMiddleware, (req, res) => res.send('OK'));
      app.use('/async-error', asyncErrorMiddleware, (req, res) => res.send('OK'));
     server =  app.listen(3000,done);
 
    } catch(e) {
      console.error("Error starting server:", e);
      throw e;
    }
  });

  afterEach((done) => {
    server.close(() => {
      done();
    })
  });

  // Basic routing
  test('GET / should return 200 OK', async () => {
    app.get('/', (req, res) => {
      res.status(200).send('Hello, World!');
    });

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
//return
  // Route parameters
  test('GET /users/:id should return user ID', async () => {
    app.get('/users/:id', (req, res) => {

      res.status(200).send(`User ID: ${req.params.id}`);
    });

    const response = await request(server).get('/users/123');
    console.log(response.status, response.text);
    expect(response.status).toBe(200);
    expect(response.text).toBe('User ID: 123');
  });

  // Query parameters
  test('GET /search should handle query parameters', async () => {
    app.get('/search', (req, res) => {
      res.status(200).send(`Search query: ${req.query.q}`);
    });

    const response = await request(server).get('/search?q=testquery');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Search query: testquery');
  });

  // POST request with JSON body
  test('POST /api/data should handle JSON body', async () => {
    app.post('/api/data', (req, res) => {
      res.status(201).json({ received: req.body });
    });

    const response = await request(server)
      .post('/api/data')
      .send({ name: 'John', age: 30 })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ received: { name: 'John', age: 30 } });
  });

  // Middleware
  test('Middleware should modify request', async () => {
    app.use((req, res, next) => {
      req.customProp = 'Modified by middleware';
      next();
    });

    app.get('/middleware-test', (req, res) => {
      res.status(200).send(req.customProp);
    });

    const response = await request(server).get('/middleware-test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Modified by middleware');
  });

  // Error handling
  // test('Should handle errors', async () => {
  //   app.get('/error', (req, res) => {
  //     throw new Error('Test error');
  //   });

  //   app.use((err, req, res, next) => {
  //     res.status(500).json({ error: err.message });
  //   });

  //   const response = await request(server).get('/error');
  //   expect(response.status).toBe(500);
  //   expect(response.body).toEqual({ error: 'Test error' });
  // });

  // 404 Not Found
  test('Should return 404 for undefined routes', async () => {
    const response = await request(server).get('/undefined-route');
    expect(response.status).toBe(404);
  });

  // Multiple methods for the same route
  test('Should handle multiple methods for the same route', async () => {
    app.get('/multi-method', (req, res) => {
      res.status(200).send('GET');
    });

    app.post('/multi-method', (req, res) => {
      res.status(200).send('POST');
    });

    const getResponse = await request(server).get('/multi-method');
    expect(getResponse.status).toBe(200);
    expect(getResponse.text).toBe('GET');

    const postResponse = await request(server).post('/multi-method');
    expect(postResponse.status).toBe(200);
    expect(postResponse.text).toBe('POST');
  });

  // Large payload
  test('Should handle large payload', async () => {
    app.post('/large-payload', (req, res) => {
 
      res.status(200).json({ size: JSON.stringify(req.body).length });
    });

    const largeObject = { data: 'x'.repeat(1000000) }; // 1MB of data
    const response = await request(server)
      .post('/large-payload')
      .send(largeObject)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.size).toBeGreaterThan(1000000);
  });

  // Chained middleware
  test('Should handle chained middleware', async () => {
    const middleware1 = (req, res, next) => {
      req.value = 1;
      next();
    };

    const middleware2 = (req, res, next) => {
      req.value += 1;
      next();
    };

    app.get('/chained-middleware', middleware1, middleware2, (req, res) => {
      res.status(200).json({ value: req.value });
    });

    const response = await request(server).get('/chained-middleware');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ value: 2 });
  });


  test('GET request to root path', async () => {
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });

  test('POST request with JSON body', async () => {
    app.post('/api/data', (req, res) => {
      res.json({ received: req.body });
    });

    const response = await request(app)
      .post('/api/data')
      .send({ name: 'John', age: 30 })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ received: { name: 'John', age: 30 } });
  });

  test('Route parameters', async () => {
    app.get('/users/:id', (req, res) => {
      res.json({ userId: req.params.id });
    });

    const response = await request(app).get('/users/123');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userId: '123' });
  });
 
  test('Custom middleware execution', async () => {
    const middleware = (req, res, next) => {
      req.customProp = 'test';
      next();
    };

    app.use(middleware);

    app.get('/middleware-test', (req, res) => {
      res.send(req.customProp);
    });

    const response = await request(app).get('/middleware-test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('test');
  });

  test('Multiple middleware execution order', async () => {
    const middleware1 = (req, res, next) => {
      req.order = ['first'];
      next();
    };
    const middleware2 = (req, res, next) => {
      req.order.push('second');
      next();
    };

    app.use(middleware1, middleware2);

    app.get('/multi-middleware', (req, res) => {
      res.json(req.order);
    });

    const response = await request(app).get('/multi-middleware');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(['first', 'second']);
  });


describe('Router', () => {
  test('Basic Router functionality', async () => {
    const router = JaiServer.Router();

    router.get('/test', (req, res) => {
      res.send('Router Test');
    });

    app.use('/router', router);

    const response = await request(app).get('/router/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Router Test');
  });

  test('Router with middleware', async () => {
    const router = JaiServer.Router();

    router.use((req, res, next) => {
      req.routerMiddleware = true;
      next();
    });

    router.get('/middleware', (req, res) => {
      res.json({ routerMiddleware: req.routerMiddleware });
    });

    app.use('/router', router);

    const response = await request(app).get('/router/middleware');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ routerMiddleware: true });
  });
});

describe('Error Handling', () => {
  test('404 for undefined routes', async () => {
    const response = await request(app).get('/undefined-route');
    expect(response.status).toBe(404);
  });

  test('Custom error handler', async () => {
    app.get('/error', (req, res) => {
      throw new Error('Test error');
    });

    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });

    const response = await request(app).get('/error');
    expect(response.status).toBe(500);
    expect(response.body.error).toEqual('Test error');
  });
});

describe('Request and Response Objects', () => {
  test('Request query parameters', async () => {
    app.get('/query', (req, res) => {
      res.json(req.query);
    });

    const response = await request(app).get('/query?name=John&age=30');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: 'John', age: '30' });
  });

  test('Response status and headers', async () => {
    app.get('/custom-response', (req, res) => {
      res.status(201).header('X-Custom-Header', 'Test').send('Created');
    });

    const response = await request(app).get('/custom-response');
    expect(response.status).toBe(201);
    expect(response.headers['x-custom-header']).toBe('Test');
    expect(response.text).toBe('Created');
  });

  test('Request body parsing (JSON)', async () => {

    app.post('/parse-json', (req, res) => {
      res.json(req.body);
    });

    const response = await request(app)
      .post('/parse-json')
      .send({ key: 'value' })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ key: 'value' });
  });

  test('Request body parsing (URL-encoded)', async () => {
    app.post('/parse-urlencoded', (req, res) => {
      console.log(req.body);
      res.json(req.body);
    });

    const response = await request(app)
      .post('/parse-urlencoded')
      .send('key=value')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ key: 'value' });
  });
});

describe('Static File Serving', () => {
  test('Serve static files', async () => {

    // Assuming there's a file named 'test.txt' in the 'public' directory
    const response = await request(app).get('/public/test.text');
    expect(response.status).toBe(200);
    // Add more specific assertions based on the content of your static files
  });


});


describe("Throw Error on Build Time",()=>{
  test('Should handle errors on Empty Use', async () => {
    // THIS WILL THROW ERROR
     expect(()=>app.use()).toThrow();
  });

  test('Should handle errors on empty Url', async () => {
    // THIS WILL THROW ERROR
     expect(()=>app.use(null,()=>{})).toThrow();
  });

  test('Should handle errors on Null', async () => {
    // THIS WILL THROW ERROR
     expect(()=>app.use(null,null,null)).toThrow();
  });
  test('Should handle errors on Wrong Type', async () => {
    // THIS WILL THROW ERROR
     expect(()=>app.use(()=>{},()=>{},1)).toThrow();
  });
  test('Should handle errors on Valid Url not invalid Middleware', async () => {
    // THIS WILL THROW ERROR
     expect(()=>app.use('/',12)).toThrow();
  });
});


describe('Middleware Error Handling', () => {


  test('Synchronous error in middleware', async () => {
    const response = await request(app).get('/error-middleware');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Test Error');
    expect(response.body).not.toHaveProperty('stack');
    expect(response.body).toHaveProperty('message', 'Internal Server Error - Jai Server');
  });

  test('Error set on request object', async () => {
    const response = await request(app).get('/set-error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Test error from middleware');
    expect(response.body).not.toHaveProperty('stack');
    expect(response.body).toHaveProperty('message', 'Internal Server Error - Jai Server');
  });

  test('Asynchronous error in middleware', async () => {
    const response = await request(app).get('/async-error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Async error');
    expect(response.body).not.toHaveProperty('stack');
    expect(response.body).toHaveProperty('message', 'Internal Server Error - Jai Server');
    
  });

  test('Error in middleware stack', async () => {
    // Add a route with multiple middleware where one throws an error
    app.use('/middleware-stack', 
      (req, res, next) => next(),
      errorMiddleware,
      (req, res) => res.send('OK')
    );

    const response = await request(app).get('/middleware-stack');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Test Error');
  });

  test('Custom error handling middleware', async () => {
    // Define a custom error handling middleware
    const customErrorHandler = (err, req, res, next) => {
      res.status(500).json({ customError: err.message });
    };

    // Add a route that uses the custom error handler
    app.use('/custom-error', errorMiddleware);
    app.use(customErrorHandler);

    const response = await request(app).get('/custom-error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('customError', 'Test Error');
  });
});


});