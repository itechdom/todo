// basic route (http://localhost:8080)
const express = require('express');
import passport from 'passport';
var bodyParser  = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session');
import googlePassport from './strategies/google.js';

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();


export
default
function({
  app,
  User,
  config
}) {

  app.use(passport.initialize());
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done)=>{
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({id}, (err, user) => {
      done(err, user);
    });
  });

  //client ID and secret
  let clientId = config.get("auth.google.clientId");
  let clientSecret = config.get("auth.google.clientSecret");
  let callbackURL = config.get("auth.google.callbackURL");

  googlePassport({
    passport,
    User,
    clientId,
    clientSecret,
    callbackURL
  });

  apiRoutes.get('/', function(req, res) {
    res.send('Hello! Passport service is working');
  });

  apiRoutes.get('/isauth',checkAuthentication,(req,res)=>{
    res.status(200).send({message:"Successful Logging In"});
  });

  apiRoutes.get('/error',function(req,res){
    res.status(401).send({message:"Error Logging In!"});
  });

  apiRoutes.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

  apiRoutes.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  (req, res)=>{
    res.redirect(`http://localhost:8080?access=${req.user.accessToken}`);
  });

  return apiRoutes;
}

//=========
// Check if the User is Authenticated
//=========
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //if user is looged in, req.isAuthenticated() will return true
        next();
    } else{
        return res.status(401).send({message:"Error Logging In!"});
    }
}
