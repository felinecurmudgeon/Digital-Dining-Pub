/*jshint camelcase: false */
var partiesModel = require('./partiesModel.js');
var url = require('url');
var JsonResponse = require('../JsonResponseObject.js');
var JsonData = require('../JsonDataObject.js');

var createJsonResponseForParty = function (data) {
  var JsonResponseObject = new JsonResponse();
  for (var i = 0; i < data.length; i++) {
    var JsonDataObject = new JsonData();
    JsonDataObject.type = 'party';
    JsonDataObject.id = data[i].id;
    JsonDataObject.attributes = {
      restaurantId: data[i].restaurant_id,
      tableId: data[i].table_id,
      partySize: data[i].party_size,
      checkedinAt: data[i].checkedin_at,
      seatedAt: data[i].seated_at,
      closedAt: data[i].closed_at
    };
    JsonResponseObject.data.push(JsonDataObject);
  }
  return JsonResponseObject;
};
// var redis = require('redis');
// var client = redis.createClient();
// client.quit();
// var redis = {};


// var usersModel = require('../users/usersModel.js');

// usersModel.user.post({
//         username: 'setTime',
//         password: '11123'})
//   .then(function(data) {
//     console.log(data.insertId);
//     console.log(data);
//     usersModel.user.put({
//       id: data.insertId,
//       password: 'caca'
//     });
//   })
//   .then(function() {
//     partiesModel.party.checkInAndCreateParty({
//       restaurant_id: 1,
//       party_size: 5,
//       user_id: 1});
//   })
//   .then(function(data) {
//     partiesModel.party.seatParty({
//       party_id: data.insertId,
//       table_id: 1});
//   })
//   .catch(function(err) {
//     console.log(err);
//   });

module.exports = {
  checkInAndCreateParty: function (req, res) {
    partiesModel.party.checkInAndCreateParty(req.body)
      .then(function (data) {
        res.status(201);
        res.send(data);
      });
  },
  editParty: function (req, res) {
    var query = url.parse(req.url, true).query;
    if (query.event === 'seat') {
      partiesModel.party.seatParty(req.params.id, req.body)
        .then(function (data) {
          res.status(200);
          res.send(data);
        });
    } else if (query.event === 'close') {
      partiesModel.party.closeParty(req.params.id)
        .then(function (data) {
          res.status(200);
          res.send(data);
        });
    } else if (query.event === 'addParticipant') {
      partiesModel.party.addUserToParty(req.params.id, req.body)
        .then(function (data) {
          res.status(200);
          res.send(data);
        });
    } else {
      res.status(400);
      res.send();
    }
  },
  get: function (req, res) {
    if (req.params.id) {
      partiesModel.party.getParty(req.params.id)
        .then(function (data) {
          var response = createJsonResponseForParty(data);
          res.status(200);
          res.send(response);
        });
    } else {
      var query = url.parse(req.url, true).query;
      if (query.rid) {
        var sendAnswer = function (callback) {
          callback(+query.rid)
            .then(function (data) {
              var response = createJsonResponseForParty(data);
              res.status(200);
              res.send(response);
            });
        };
        if (query.status === 'waiting') {
          sendAnswer(partiesModel.party.getCheckedInParties);
        } else if (query.status === 'seated') {
          sendAnswer(partiesModel.party.getCurrentParties);
        } else if (query.status === 'canceled') {
          sendAnswer(partiesModel.party.getCanceledParties);
        } else if (query.status === 'ended') {
          sendAnswer(partiesModel.party.getFinishedParties);
        } else {
          sendAnswer(partiesModel.party.getAllParties);
        }
      } else {
        res.status(400);
        res.send();
      }
    }
  }
};
