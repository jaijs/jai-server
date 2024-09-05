let jaiServer = require('./dist/index.js');

const app = jaiServer();

app.listen(1111, () => {
  console.log('Server started on port 1111');
});

app.stack = [];

app.get('/', (req, res, next) => {
  res.send('Hello World');
  next();
});

app.use(
  (req, res, next) => {
    console.log('middleware');
    next();
  },
  (err, req, res, next) => {
    console.log('error middleware');
    next();
  }
);

app.get('/error', (req, res) => {
  throw new Error('Test error');
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
