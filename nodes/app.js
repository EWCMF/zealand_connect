var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var internshipPostRouter = require('./routes/internship_post');
var internshipUpdateRouter = require('./routes/internship_update');
var mit_CVRouter = require('./routes/mit-CV');
var searchCVRouter = require('./routes/search-cv');
var loginRouter = require('./routes/login');
var languageRouter = require('./routes/language')
var forsideRouter = require('./routes/forside')

var cookieParser = require('cookie-parser');

const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./config/passport_setup');

var opretBrugerRouter = require('./routes/opretBruger');
var loginStudentRouter = require('./routes/login-student');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/internship_post', internshipPostRouter);
app.use('/internship_update', internshipUpdateRouter);
app.use('/mit-CV', mit_CVRouter);
app.use('/search-cv', searchCVRouter);
app.use('/login', loginRouter);
app.use('*/language', languageRouter)
app.use('/forside', forsideRouter);
app.use(cookieSession({
  maxAge: 10006060*24,
  keys: ["this_is_the_secret_cookie_encryption_key"]
}));

app.use('/opretBruger', opretBrugerRouter);
app.use('/login-student', loginStudentRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
