const JaiServer = require('jai-server');

const app = JaiServer();
const router = JaiServer.Router();

router.get('/hello', (req, res) => {
  res.send('Hello World!');
});
app.use(router);
app.get('/', (req, res) => {
  res.send('Home Page!');
});

app.listen({ port: 3000 }, (...args) => {
  console.log('Server is running on port http://localhost:3000', args);
});
