/*jshint camelcase: false */

// var redis = require('redis');
// var client = redis.createClient();
// client.quit();
// var redis = {};
var partiesModel = require('./partiesModel.js');
var usersModel = require('../users/usersModel.js');

usersModel.user.post({
        username: 'setTime',
        password: '11123'})
  .then(function(data) {
    console.log(data.insertId);
    console.log(data);
    usersModel.user.put({
      id: data.insertId,
      password: 'caca'
    });
  })
  .catch(function(err) {
    console.log(err);
  });
partiesModel.party.checkInAndCreateParty({
        restaurant_id: 1,
        party_size: 5,
        user_id: 1});

module.exports = {

};


/*

available tables will be stored in a redis set availableTable:restauId
menus will be stored in 


*/
