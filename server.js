// server.js
// where your node app starts

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

// the process.env values are set in .env
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'https://'+process.env.PROJECT_NAME+'.glitch.me/login/google/return',
  scope: 'https://www.googleapis.com/auth/plus.login'
},
function(token, tokenSecret, profile, cb) {
  
    console.log(token);
  return cb(null, profile);
}));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// init project
var express = require('express');
var app = express();
var expressSession = require('express-session');

// cookies are used to save authentication
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(expressSession({ secret:'watchingfairies', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// index route
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// on clicking "logoff" the cookie is cleared
app.get('/logoff',
  function(req, res) {
    res.clearCookie('google-passport-example');
    res.redirect('/');
  }
);

app.get('/auth/google', passport.authenticate('google'));

app.get('/login/google/return', 
  passport.authenticate('google', 
    { successRedirect: '/setcookie', failureRedirect: '/' }
  )
);

// on successful auth, a cookie is set before redirecting
// to the success view
app.get('/setcookie',
  function(req, res) {
    res.cookie('google-passport-example', new Date());
    res.redirect('/success');
  }
);

// if cookie exists, success. otherwise, user is redirected to index
app.get('/success',
  function(req, res) {
    if(req.cookies['google-passport-example']) {
      res.sendFile(__dirname + '/views/success.html');
    } else {
      res.redirect('/');
    }
  }
);

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
