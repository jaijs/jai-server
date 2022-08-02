const JaiServer = require('jai-server');

const app = JaiServer();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen({ port: 3000 }, (...args) => {
  console.log('Server is running on port http://localhost:3000', args);
});
