// server.js
// where your node app starts

// set up twitter passport for oauth
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;

passport.use(new Strategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
},
function(token, tokenSecret, profile, cb) {
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
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var connect = require('connect-ensure-login');

app.use(cookieParser());
app.use(express.static('public'));
app.use(expressSession({ secret:'watchingferries', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/', 
  passport.authenticate('local', { 
    successReturnToOrRedirect: '/success', 
    failureRedirect: '/login'
  })
);

app.get('/logoff',
  function(req, res) {
    res.clearCookie('twitter-passport-example');
    res.redirect('/');
  }
);

app.get('/login/twitter', passport.authenticate('twitter'));

app.get('/login/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.cookie('twitter-passport-example', new Date())
    res.redirect('/success');
  }
);

app.get('/success',
  connect.ensureLoggedIn('/'),
  function(req, res) {
    res.sendFile(__dirname + '/views/success.html');
  }
);

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
