var mysql = require('mysql');

var con = mysql.createConnection({
  host: 'localhost',
  user: process.env.MYSQL_DDUSER, //set this in your bash profile
  password: process.env.MYSQL_DDPASSWORD, //set this in your bash profile
  database: process.env.MYSQL_DDDATABASE //set this in your bash profile
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
