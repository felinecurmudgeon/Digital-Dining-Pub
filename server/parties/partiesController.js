/*jshint camelcase: false */
var partiesModel = require('./partiesModel');
var restaurantsModel = require('../restaurants/restaurantsModel.js');
var url = require('url');
var JsonResponse = require('../JsonResponseObject');
var JsonData = require('../JsonDataObject');
var nameGenerator = require('./nameGenerator');

var createJsonResponseForParty = function (partyData, included) {
  var JsonResponseObject = new JsonResponse();
  var tableIds = [];
  for (var i = 0; i < partyData.length; i++) {
    var JsonDataObject = new JsonData();
    JsonDataObject.type = 'party';
    JsonDataObject.id = partyData[i].id;
    JsonDataObject.attributes = {
      restaurantId: partyData[i].restaurant_id,
      tableId: partyData[i].table_id,
      partySize: partyData[i].party_size,
      partyName: partyData[i].party_name,
      checkedinAt: partyData[i].checkedin_at,
      seatedAt: partyData[i].seated_at,
      closedAt: partyData[i].closed_at
    };
    tableIds.push(partyData[i].table_id);
    JsonResponseObject.data.push(JsonDataObject);
  }
  if (included.tables) {
    for (var j = 0; j < included.tables.length; j++) {
      if (tableIds.indexOf(included.tables[j].id) !== -1) {
        var JsonDataObjectIncluded = new JsonData();
        JsonDataObjectIncluded.type = 'tables';
        JsonDataObjectIncluded.id = included.tables[j].id;
        JsonDataObjectIncluded.attributes = {
          restaurantId: included.tables[j].restaurant_id,
          tableNumber: included.tables[j].table_number,
          seats: included.tables[j].seats,
          available: included.tables[j].available
        };
        JsonResponseObject.included.push(JsonDataObjectIncluded);
      }
    }
  }
  return JsonResponseObject;
};

var getAvailablePartyName = function () {
  var name = nameGenerator();
  return partiesModel.party.getOpenPartiesByName(name)
    .then(function (data) {
      if (data.length === 0) {
        return name;
      } else {
        return getAvailablePartyName();
      }
    });
};

module.exports = {
  checkInAndCreateParty: function (req, res) {
    getAvailablePartyName()
      .then(function (partyName) {
        partiesModel.party.checkInAndCreateParty({
          party_name: partyName,
          restaurant_id: req.body.restaurant_id,
          party_size: req.body.party_size,
          user_id: req.user.id})
          .then(function (data) {
            res.status(201);
            res.send(data);
          });
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
      if (req.query.rid) {
        var sendAnswer = function (callback) {
          callback(+req.query.rid)
            .then(function (data) {
              restaurantsModel.tables.get(+req.query.rid)
                .then(function (tables) {
                  var response = createJsonResponseForParty(data, {tables: tables});
                  res.status(200);
                  res.send(response);
                });
            });
        };
        if (req.query.status === 'waiting') {
          sendAnswer(partiesModel.party.getCheckedInParties);
        } else if (req.query.status === 'seated') {
          sendAnswer(partiesModel.party.getCurrentParties);
        } else if (req.query.status === 'canceled') {
          sendAnswer(partiesModel.party.getCanceledParties);
        } else if (req.query.status === 'ended') {
          sendAnswer(partiesModel.party.getFinishedParties);
        } else {
          sendAnswer(partiesModel.party.getAllParties);
        }
      } else if (req.query.user) {
        partiesModel.party.getCurrentPartyForUser(req.user.id)
          .then(function (data) {
            var response = null;
            if (data[0] !== undefined) {
              response = createJsonResponseForParty(data);
            }
            res.status(200);
            res.send(response);
          });
      } else {
        res.status(400);
        res.send();
      }
    }
  }
};
