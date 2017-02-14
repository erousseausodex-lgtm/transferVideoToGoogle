// server.js
// where your node app starts

// set up twitter passport for oauth
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
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
var expressSession = require('express-session');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(expressSession({ secret:'watchingferries', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/logoff',
  function(req, res) {
    res.clearCookie('twitter-passport-example');
    res.redirect('/');
  }
);

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/login/twitter/return', 
  passport.authenticate('twitter', 
    { successRedirect: '/setcookie', failureRedirect: '/' }
  )
);

app.get('/setcookie',
  function(req, res) {
    res.cookie('twitter-passport-example', new Date());
    res.redirect('/success');
  }
);

app.get('/success',
  function(req, res) {
    if(req.cookies['twitter-passport-example']) {
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
