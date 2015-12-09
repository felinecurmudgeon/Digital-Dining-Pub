/*jshint camelcase: false */

var partiesModel = require('./partiesModel.js');

module.exports = {
  checkInAndCreateParty: function (req, res) {
    partiesModel.party.checkInAndCreateParty(req.body)
      .then(function (data) {
        res.status(201);
        res.send(data);
      });
  },
  editParty: function (req, res) {
    if (req.body.event === 'seat') {
      partiesModel.party.seat(req.params.id, req.body)
        .then(function (data) {
          res.status(200);
          res.send(data);
        });
    } else if (req.body.event === 'addParticipant') {
      partiesModel.party.addUserToParty(req.params.id, req.body)
        .then(function (data) {
          res.status(200);
          res.send(data);
        });
    } else {
      res.status(400);
      res.send();
    }
  }
};
