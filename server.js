const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config/config.json');
require('dotenv').load();

const app = express();
const index = require('./routes');

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    key: 'mySession',
    secret: 'loftschool',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null
    },
    saveUninitialized: false,
    resave: false
  })
);

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if (req.path === '/favicon.ico') {
    return null;
  }
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});

const server = app.listen(process.env.PORT || 3000, function() {
  if (!fs.existsSync(config.upload)) {
    fs.mkdirSync(config.upload);
  }
  console.log('Example app listening on port ' + server.address().port);
});
