// server.js
// where your node app starts

var passport = require('passport');
var google = require('googleapis');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var GoogleSpreadsheets = require('google-spreadsheets');

// the process.env values are set in .env
var clientID = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;
var callbackURL = 'https://'+process.env.PROJECT_NAME+'.glitch.me/login/google/return';
var scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly',
              'https://www.googleapis.com/auth/plus.login'];
var oauth2Client = new google.auth.OAuth2(clientID, clientSecret, callbackURL);

var url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,

  // Optional property that passes state parameters to redirect URI
  // state: { foo: 'bar' }
});

passport.use(new GoogleStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: callbackURL,
  scope: scopes
},
function(token, tokenSecret, profile, cb) {
  oauth2Client.setCredentials({
    access_token: token
  });
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
app.use(expressSession({ secret:'watchingmonkeys', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// index route
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// on clicking "logoff" the cookie is cleared
app.get('/logoff',
  function(req, res) {
    res.clearCookie('google-auth');
    res.redirect('/');
  }
);

app.get('/auth/google', function(req, res) {
  res.redirect(url);
});

app.get('/login/google/return', function(req, res) {
  console.log(req.params.code);
    oauth2Client.getToken(req.params.code, function (err, tokens) {
      // Now tokens contains an access_token and an optional refresh_token. Save them.
      if (!err) {
        oauth2Client.setCredentials(tokens);
        res.redirect('/setcookie');
      } else {
        console.log("Aww man, " + err);
      }
    });
  }
);

// on successful auth, a cookie is set before redirecting
// to the success view
app.get('/setcookie',
  function(req, res) {
    res.cookie('google-auth', new Date());
    res.redirect('/success');
  }
);

// if cookie exists, success. otherwise, user is redirected to index
app.get('/success',
  function(req, res) {
    if(req.cookies['google-auth']) {
      
      GoogleSpreadsheets({
        key: process.env.SHEET_KEY,
        auth: oauth2Client
      }, function(err, spreadsheet) {
        if(err){
          console.log("Aww man, " + err);
        } else {
          console.log(JSON.stringify(spreadsheet));
          spreadsheet.worksheets[0].cells({
            range: 'R1C1:R1C10'
          }, function(err, cells) {
            console.log("Got data, lookit: " + cells);
            res.send(cells);
          });
        }
      });
    } else {
      res.redirect('/');
    }
  }
);

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
