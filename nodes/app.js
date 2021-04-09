const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const profilRouter = require('./routes/profil');
const internshipPostRouter = require('./routes/internship_post');
const internshipUpdateRouter = require('./routes/internship_update');
const internshipPostViewRouter = require('./routes/internship_view');
const adminFunktionerRouter = require('./routes/admin-funktioner');
const mit_CVRouter = require('./routes/mit-cv');
const searchCVRouter = require('./routes/search-cv');
const searchPraktikRouter = require('./routes/search-praktik');
const searchVirksomhederRouter = require('./routes/search-virksomheder');
const mineOpslagRouter = require('./routes/mine-opslag');
const loginRouter = require('./routes/login');
const languageRouter = require('./routes/language');
const cookieRouter = require('./routes/cookie-confirm');
const forsideRouter = require('./routes/forside');
const kontaktRouter = require('./routes/kontakt');
const omRouter = require('./routes/om');
const opretBrugerRouter = require('./routes/opret-bruger');
const newsRouter = require('./routes/news');
const forgotPasswordRouter = require('./routes/forgot-password');
const resetPasswordRouter = require('./routes/reset-password');
const dataConsentRouter = require('./routes/data-consent');
const cookiePolicyRouter = require('./routes/cookie-policy');
const internshipInfoRouter = require('./routes/internship-info');

const bodyParser = require('body-parser')

const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./config/passport_setup');

const hbs = require("express-handlebars");

const findUserByEmail = require('./persistence/usermapping').findUserByEmail;
const models = require('./models');

const app = express();

// view engine setup

app.engine(
  "hbs",
  hbs({
    helpers: {
      paginate: require('handlebars-paginate'),

      selectState: (state, value) => {
        if(state === value) {
            return 'selected';
        }
        return '';
      },

      checkedState: (state) => {
        if(state === 'true' || state === true){
            return 'checked';
        }
        return '';
      },

      checkedStateRadio: (state, id) => {
        if (state === 'true' || state === true) {
          if (id == 'tilgaengelighed1') {
            return 'checked'
          }
        }
        if (state === 'false' || state === false) {
          if (id == 'tilgaengelighed2') {
            return 'checked'
          }
        }
        return '';
      },

      checkedStateURL: (url, key, value) => {
        if (url.indexOf(key + "=") == -1) {
          return '';
        }

        string = url.substring(url.indexOf(key + "="));
        if (string.indexOf('&') > -1) {
          string = string.substring(0, string.indexOf('&'));
        }

        if (string == `${key}=${value}`) {
          return 'checked';
        }

        return '';
      }
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

if (app.get('env') == 'production') {
  app.use(logger('common', { skip: function(req, res) { return res.statusCode < 400 } }));
} else {
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
  maxAge: 1000*60*60*2,
  keys: ["this_is_the_secret_cookie_encryption_key"]
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.text({ type: "text/plain"}));
// Middleware til at finde login status i alle routes.
app.use(async function (req, res, next) {
  res.locals.missingConsent = false;
  if (req.user == null || req.user === undefined) {
    next();
  } else {
    var userRole = await findUserByEmail(req.user);

    if(userRole instanceof models.Student){
      res.locals.isStudent = true;
      res.locals.missingConsent = !userRole.user_data_consent;
    }
    if(userRole instanceof models.Virksomhed){
      res.locals.isCompany = true;
      res.locals.missingConsent = !userRole.user_data_consent;
    }
    if(userRole instanceof models.Admin){
      res.locals.isAdmin = true;
    }
    res.locals.user = userRole;
    next();
  }
});

app.use('/internship_post', internshipPostRouter);
app.use('/internship_update', internshipUpdateRouter);
app.use('/internship_view', internshipPostViewRouter);
app.use('/mit-cv', mit_CVRouter);
app.use('/search-cv', searchCVRouter);
app.use('/search-praktik', searchPraktikRouter);
app.use('/search-virksomheder', searchVirksomhederRouter);
app.use('/mine-opslag', mineOpslagRouter);
app.use('/login', loginRouter);
app.use('*/language', languageRouter);
app.use('*/cookie-confirm', cookieRouter);
app.use('/', forsideRouter);
app.use ('/profil', profilRouter);
app.use ('/admin-funktioner', adminFunktionerRouter);
app.use('/opret-bruger', opretBrugerRouter);
app.use('/kontakt', kontaktRouter);
app.use('/om', omRouter);
app.use('/news', newsRouter);
app.use('/forgot-password', forgotPasswordRouter);
app.use('/reset-password', resetPasswordRouter);
app.use('/data-consent', dataConsentRouter);
app.use('/cookie-policy', cookiePolicyRouter);
app.use('/internship-info', internshipInfoRouter);

// Create static path mapping to dawa autocomplete directory in node_modules
app.use('/dawa', express.static(__dirname + '/node_modules/dawa-autocomplete2/dist/'));

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
  res.render('error', {layout: false});
});

module.exports = app;
