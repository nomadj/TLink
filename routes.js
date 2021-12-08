const routes = require('next-routes')();

routes
  .add('/schools/new', '/schools/new')
  .add('/schools/:address', '/schools/show')
  .add('/schools/:address/students', '/schools/students/index')
  .add('/schools/:address/students/new', '/schools/students/new')

module.exports = routes;
