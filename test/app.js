// app.js
const JaiServer = require('../src/index');

const app = JaiServer();

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the root route!' });
});

// User routes
const userRouter = JaiServer.Router();

userRouter.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

userRouter.get('/:id', (req, res) => {
  res.json({ message: `Get user with id ${req.params.id}` });
});

userRouter.post('/', (req, res) => {
  res.json({ message: 'Create a new user' });
});

app.use('/users', userRouter);

// Product routes without router
app.get('/products', (req, res) => {
  res.json({ message: 'Get all products' });
});

app.get('/products/:id', (req, res) => {
  res.json({ message: `Get product with id ${req.params.id}` });
});

app.post('/products', (req, res) => {
  res.json({ message: 'Create a new product' });
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});
const http = require('http')
server = http.createServer(app);
server.listen(2222, () => {
  const { port } = server.address();
  baseURL = `http://localhost:${port}`;
  console.log(baseURL)

});
module.exports = app;