// Load in our dependencies
const express = require('express');

// Define a static hosting server that can be loaded in `gulp` or for one-time build
exports.start = function () {
  let app = express();
  app.use(express.static(__dirname + '/../build'));
  app.listen(3000);
  console.info('Server is listening at http://localhost:3000/');
};

// If we are being run directly, then start our server
if (require.main === module) {
  exports.start();
}
