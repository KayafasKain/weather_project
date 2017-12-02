const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db_connection = require('./db/db_config.js');
const config = require('config');

const jwt    = require('jsonwebtoken');

const user_api = require('./routes/user.js');
const weather_api = require('./routes/weather.js');

const app = express();
app.use(morgan('dev'));
if(config.util.getEnv('NODE_ENV') == 'start') {
  app.use(morgan('common'));
}
if(config.util.getEnv('NODE_ENV') == 'dev') {
  app.use(morgan('dev'));
}
if(config.util.getEnv('NODE_ENV') == 'test') {
  app.use(morgan('tiny')); 
}




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', user_api);
app.use('/api/weather_api', weather_api);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
	res.status(500).json({
	        message: err.message,
	        error: err
	    });
});

// connectig to DB
db_connection.start_db();

module.exports = app;
