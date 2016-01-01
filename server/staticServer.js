var express = require('express');
var app = express();

app.use(express.static(__dirname + '/../landing'));

app.listen(3000);
