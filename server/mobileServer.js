var express = require('express');
var app = express();

app.use(express.static(__dirname + '/../client-mobile/www'));

app.listen(8200);