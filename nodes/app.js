var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var profilRouter = require('./routes/profil');
var internshipPostRouter = require('./routes/internship_post');
var internshipUpdateRouter = require('./routes/internship_update');
var internshipPostViewRouter = require('./routes/internship_view')
var mit_CVRouter = require('./routes/mit-CV');
var searchCVRouter = require('./routes/search-cv');
var searchPraktikRouter = require('./routes/search-praktik');
var loginRouter = require('./routes/login');
var languageRouter = require('./routes/language')
var forsideRouter = require('./routes/forside')
var profilRouter = require('./routes/profil')
var praktikforloebRouter = require('./routes/praktikforloebet');
var cookieParser = require('cookie-parser');

const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./config/passport_setup');

const hbs = require("express-handlebars");

var opretBrugerRouter = require('./routes/opret-bruger');
var loginStudentRouter = require('./routes/login-student');


var app = express();

// view engine setup

app.engine(
  "hbs",
  hbs({
    helpers: {
      paginate: require('handlebars-paginate')
    },
    partialsDir: ["views/partials"],
    extname: ".hbs",
    layoutsDir: "views",
    defaultLayout: "layout",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true
    }
  })
);
app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
  maxAge: 1000*60*60*24,
  keys: ["this_is_the_secret_cookie_encryption_key"]
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/profil', profilRouter);
app.use('/internship_post', internshipPostRouter);
app.use('/internship_update', internshipUpdateRouter);
app.use('/internship_view', internshipPostViewRouter);
app.use('/mit-CV', mit_CVRouter);
app.use('/search-cv', searchCVRouter);
app.use('/search-praktik', searchPraktikRouter);
app.use('/login', loginRouter);
app.use('*/language', languageRouter)
app.use('/', forsideRouter);
app.use('/praktikforloebet', praktikforloebRouter);
app.use ('/profil', profilRouter)

app.use('/opret-bruger', opretBrugerRouter);
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
