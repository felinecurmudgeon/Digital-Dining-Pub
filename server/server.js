var express = require('express'); 
var session = require('express-session');
var router = require('./router.js'); 
var bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser'); 
var logger = require('./middleware/logger');

var app = express();
var expressRouter = express.Router(); 
app.use(express.static(__dirname + '/../client-mobile'));

//cookie parser
app.use(cookieParser());

// parse application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: 'feline'}));  
app.use(logger);
app.use(bodyParser.json());

//set up router 
app.use('/', expressRouter); 
router(expressRouter); 

app.listen(8000); 

module.exports = app; 

