let jaiServer = require('../../dist/index');

const path = require('path');

const app = jaiServer({
  static: { dir: path.join(__dirname) }
});

const router = jaiServer.Router();

router.get('/users1', (req, res) => {
  res.send('<h1>Users Page</h1>');
});

const port = 3000;

router.use((req, res, next) => {
  req.routerMiddleware = true;
  next();
});

router.get('/middleware', (req, res) => {
  res.json({ routerMiddleware: req.routerMiddleware });
});

app.use('/router', router);

app.get('/', (req, res) => {
  res.send('<h1>Home Page</h1>');
  // res.sendFile(path.join(__dirname));
});

app.get('/about', (req, res) => {
  res.send('<h1>About Page</h1>');
});

// Route to handle form submission
app.post('/submit', (req, res) => {
  console.log('Form data received:', req.body);
  res.send(`
    <h1>Form Submission Received</h1>
    <p>Name: ${req.body.name}</p>
    <p>Email: ${req.body.email}</p>
    <p>Message: ${req.body.message}</p>
    <a href="/">Back to Form</a>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});