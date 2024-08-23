
const express = require('./src/index');

  const app = express({});
  const port = 2222;

  // Middleware for logging requests
//   app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//     next();
//   });

  // Define a route
  app.get('/', (req, res) => {
    res.json({ hello: 'world'});
  });

//   // Error handling middleware
//   app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
//   });

  // Start the server
  app.listen(port, () => {
    console.log(`Worker ${process.pid} started and listening on port ${port}`);
  });

