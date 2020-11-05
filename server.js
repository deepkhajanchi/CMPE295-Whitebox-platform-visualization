const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes');
const port = process.env.PORT || 4000;

// Setup  cors setting
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin");
  next();
});

app.set('view options', { layout: false });
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(port, () => {
  console.log(`Visualizer is served at http://localhost:${port}`)
})