const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const serviceRequestRouter = require('./routes/servicerequest');
const taskRouter = require('./routes/task');

const app = express();

// set up session cookie
const oneHour = 1000 * 60 * 60;
const sess = {
  secret: 'GF0aWVudF9iYW5uZXIiOmZhbHNlLCJzb',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: oneHour }
}
app.set('trust proxy', 1) // trust first proxy
if (app.get('env') === 'production') {
  sess.cookie.secure = true // serve secure cookies
}  
app.use(session(sess));

// *********************************
// App Authorization Client ID

app.locals.fhir_base_url = 'https://launch.smarthealthit.org/v/r4/fhir';

// *********************************

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/servicerequest', serviceRequestRouter);
app.use('/task', taskRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err.response !== undefined && err.response.data !== undefined && err.response.data.resourceType == "OperationOutcome") {
    res.locals.outcome = err.response.data;
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
