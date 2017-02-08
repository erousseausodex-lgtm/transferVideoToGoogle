// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// set up twitter passport for oauth
var twitterAPI = require('./config');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var username = '';

passport.use(new Strategy({
  consumerKey: twitterAPI.consumer_key,
  consumerSecret: twitterAPI.consumer_secret,
  callbackURL: twitterAPI.callback_url
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

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
