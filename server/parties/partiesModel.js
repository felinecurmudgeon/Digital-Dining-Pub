/*jshint -W079 */
/*jshint camelcase: false */
var db = require('../sql-db/index.js');
var Promise = require('bluebird');

module.exports = {
  party: {
    getCheckedInParties: function (restaurantId) {
      //retrieves all checked_in parties that are not started yet for a given restaurantId
      return new Promise(function (resolve, reject) {
        db.con.query('SELECT * FROM parties \
                      WHERE restaurant_id = ? \
                      AND checkedin_at IS NOT NULL \
                      AND seated_at IS NULL \
                      AND closed_at IS NULL', restaurantId, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    getCurrentParties: function (restaurantId) {
      //retrieves all seated parties that are not finished yet for a given restaurantId
      return new Promise(function (resolve, reject) {
        db.con.query('SELECT * FROM parties \
                      WHERE restaurant_id = ? \
                      AND checkedin_at IS NOT NULL \
                      AND seated_at IS NOT NULL \
                      AND closed_at IS NULL', restaurantId, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    getCanceledParties: function (restaurantId) {
      //retrieves all seated parties that are not finished yet for a given restaurantId
      return new Promise(function (resolve, reject) {
        db.con.query('SELECT * FROM parties \
                      WHERE restaurant_id = ? \
                      AND seated_at IS NULL \
                      AND closed_at IS NOT NULL', restaurantId, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    getFinishedParties: function (restaurantId) {
      //retrieves all seated parties that are not finished yet for a given restaurantId
      return new Promise(function (resolve, reject) {
        db.con.query('SELECT * FROM parties \
                      WHERE restaurant_id = ? \
                      AND seated_at IS NOT NULL \
                      AND closed_at IS NOT NULL', restaurantId, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    getAllParties: function (restaurantId) {
      //retrieves all seated parties that are not finished yet for a given restaurantId
      return new Promise(function (resolve, reject) {
        db.con.query('SELECT * FROM parties WHERE restaurant_id = ?', restaurantId, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    getParty: function (partyId) {
      return new Promise(function (resolve, reject) {
        db.con.query('SELECT * FROM parties WHERE id = ?', partyId, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    checkInAndCreateParty: function (parameters) {
    /*creates a new party; expected parameters: restaurant_id, party_size, user_id,
    and creates the corresponding particpant in party_participants
    All of this is ine one SQL transaction*/
      return new Promise(function (resolve, reject) {
        db.con.beginTransaction(function (err) {
          if (err) {
            reject(err);
          }
          var partyParameters = {
            restaurant_id: parameters.restaurant_id,
            party_size: parameters.party_size,
            checkedin_at: new Date().toMysqlFormat()
          };
          db.con.query('INSERT INTO parties SET ?', partyParameters, function (err, createdParty) {
            if (err) {
              return db.con.rollback(function () {
                reject(err);
              });
            }
            partyParameters.id = createdParty.insertId;
            var partyParticipantParameters = {
              party_id: createdParty.insertId,
              user_id: parameters.user_id
            };
            db.con.query('INSERT INTO party_participants SET ?', partyParticipantParameters, function (err, createdParticipant) {
              if (err) {
                return db.con.rollback(function () {
                  reject(err);
                });
              }
              db.con.commit(function (err) {
                if (err) {
                  return db.con.rollback(function () {
                    reject(err);
                  });
                }
                partyParticipantParameters.id = createdParticipant.insertId;
                partyParameters.participants = [partyParticipantParameters];
                resolve(partyParameters);
              });
            });
          });
        });
      });
    },
    seatParty: function (partyId, parameters) {
      /* seats a party, and assignes it to a table, changing the status of the table
      expected parameters: table_id */
      return new Promise(function (resolve, reject) {
        db.con.beginTransaction(function (err) {
          if (err) {
            reject(err);
          }
          var partyParameters = {
            table_id: parameters.table_id,
            seated_at: new Date().toMysqlFormat()
          };
          db.con.query('UPDATE parties SET ? WHERE party_id = ?', [partyParameters, partyId], function (err) {
            if (err) {
              return db.con.rollback(function () {
                reject(err);
              });
            }
            db.con.query('UPDATE tables SET available = FALSE WHERE id = ?', parameters.table_id, function (err) {
              if (err) {
                return db.con.rollback(function () {
                  reject(err);
                });
              }
              db.con.commit(function (err) {
                if (err) {
                  return db.con.rollback(function () {
                    reject(err);
                  });
                }
                partyParameters.id = partyId;
                resolve(partyParameters);
              });
            });
          });
        });
      });
    },
    closeParty: function (partyId) {
      return new Promise(function (resolve, reject) {
        var partyParameters = {
          closed_at: new Date().toMysqlFormat()
        };
        db.con.query('UPDATE parties SET ? WHERE party_id = ?', [partyParameters, partyId], function (err) {
          if (err) {
            reject(err);
          } else {
            partyParameters.id = partyId;
            resolve(partyParameters);
          }
        });
      });
    },
    addUserToParty: function (partyId, parameters) {
    /*adds a user to a party, expected parameters: user_id */
      return new Promise(function (resolve, reject) {
        var partyParticipantsParameters = {
          party_id: partyId,
          user_id: parameters.user_id
        };
        db.con.query('INSERT INTO party_participants SET ?', partyParticipantsParameters, function (err, data) {
          if (err) {
            reject(err);
          } else {
            partyParticipantsParameters.id = data.insertId;
            resolve(partyParticipantsParameters);
          }
        });
      });
    }
  }
};

