var mysql = require('mysql');

//adding helper function to translate a Date object in mysql format
var twoDigits = function (d) {
    if (0 <= d && d < 10) {
      return '0' + d.toString();
    }
    if (-10 < d && d < 0) {
      return '-0' + (-1 * d).toString();
    }
    return d.toString();
};
Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + '-' + twoDigits(1 + this.getUTCMonth()) + '-' + twoDigits(this.getUTCDate()) + ' ' + twoDigits(this.getUTCHours()) + ':' + twoDigits(this.getUTCMinutes()) + ':' + twoDigits(this.getUTCSeconds());
};

var con = mysql.createConnection({
  host: 'localhost',
  user: process.env.MYSQL_DDUSER, //set this in your bash profile
  password: process.env.MYSQL_DDPASSWORD, //set this in your bash profile
  database: 'digitaldining'
});

con.connect(function (err) {
  if (err) {
    console.log('Error connecting to Db: ', err);
    return;
  }
  console.log('Connection established');
});

module.exports = {
  con: con
};
