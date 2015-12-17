var express = require('express');
var router = require('./router.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('./middleware/logger');
var passport = require('passport');
var tokenVerification = require('./middleware/verification');

var app = express();
var expressRouter = express.Router();

app.use(express.static(__dirname + '/../client'));

//cookie parser
app.use(cookieParser());

// parse application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser());
app.use(tokenVerification);
app.use(logger);
app.use(passport.initialize());
require('./auth/authController.js').initializePassportFB();

//set up router
app.use('/', expressRouter);
router(expressRouter, passport);

app.listen(8000);

module.exports = app;

