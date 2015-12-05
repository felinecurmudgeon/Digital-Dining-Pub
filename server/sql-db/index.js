var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "curmudgeon",
  password: "password",
  database:"digitaldining"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

module.exports = {
  con:con
};
