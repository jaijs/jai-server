let jaiServer = require('./src/index');

const app = jaiServer();
app.get('/', (req, res, next) => {
  res.send('Hello World');
  next();
});
app.listen(1111, () => {
  console.log('Server started on port 1111');
});



