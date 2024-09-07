let jaiServer = require('./src/index.ts');
const path = require('path');
const app = jaiServer({

});


app.get('/', (req, res, next) => {

  res.send('Hello World - Jai Server');
  //next(); // calling next middleware
});

app.listen(1111, () => {
  console.log('Server started on port 1111');
});


// const router = jaiServer.Router();
// router['get']('/test', (req, res, next) => {
//   res.send('Test');
//   next();
// });

// app.use(router); // Use router

// app.use( // Middleware
//   (req, res, next) => {
//     console.log('middleware');
//     next();
//   },
//   (err, req, res, next) => {
//     console.log('error middleware');
//     next();
//   }
// );

// app.get('/error', (req, res) => { // Error route
//   throw new Error('Test error');
// });

// app.use((err, req, res, next) => { // Error handler
//   res.status(500).json({ error: err.message });
// });
