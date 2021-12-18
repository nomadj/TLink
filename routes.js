const routes = require('next-routes')();

routes
  .add('/schools/new', '/schools/new')
  .add('/schools/:address', '/schools/show')
  .add('/schools/:address/students', '/schools/students/index')
  .add('/schools/:address/students/new', '/schools/students/new')
  .add('/schools/:address/courses', '/schools/courses/index')
  .add('/schools/:address/courses/new', '/schools/courses/new')
  .add('/schools/:address/courses/:courseName', '/schools/courses/show')
  .add('/schools/:address/courses/:courseName/students', '/schools/courses/students/index')
  .add('/schools/:address/courses/:courseName/students/new', '/schools/courses/students/new');

module.exports = routes;
