const JaiServer = require('jai-server');

const App = JaiServer(
  {
    static: {
      dir: `${__dirname}/public`, // public folder,
      basePath: '/static', // Optional
    },

  },
);

App.listen({ port: 3000 }, (...args) => {
  console.log('Server is running on port http://localhost:3000', args);
});
