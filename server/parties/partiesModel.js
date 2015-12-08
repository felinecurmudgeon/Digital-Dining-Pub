/*jshint -W079 */
/*jshint camelcase: false */

var db = require('../sql-db/index.js');
var Promise = require('bluebird');

//adding helper function to translate a Date object in mysql format
var twoDigits = function (d) {
    if(0 <= d && d < 10) {
      return "0" + d.toString();
    }
    if(-10 < d && d < 0) {
      return "-0" + (-1*d).toString();
    }
    return d.toString();
};
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};


module.exports = {
  party: {
    getCheckedInParties: function (restaurantId) {
      //retrieves all checked_in parties that are not started yet for a given restaurantId
      return new Promise( function (resolve, reject) {
        db.con.query("SELECT * FROM parties \
                      WHERE id = " + restaurantId +
                      "AND checkedin_at IS NOT NULL \
                      AND seated_at IS NULL \
                      AND closed_at IS NULL", function (err, data) {
          if(err){
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    getCurrentParties: function (restaurantId) {
      //retrieves all seated parties that are not finished yet for a given restaurantId
      return new Promise( function (resolve, reject) {
        db.con.query("SELECT * FROM parties \
                      WHERE id = " + restaurantId +
                      "AND checkedin_at IS NOT NULL \
                      AND seated_at IS NOT NULL \
                      AND closed_at IS NULL", function (err, data) {
          if(err){
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    checkInAndCreateParty: function (parameters) {
    /*creates a new party; expected parameters: restaurant_id, party_size, user_id, checkedin_at
    and creates the corresponding particpant in party_participants
    All of this is ine one SQL transaction*/
      return new Promise(function (resolve, reject) {
        db.con.beginTransaction(function (err) {
          if (err) { reject(err); }
          var partyParameters = {
            restaurant_id: parameters.restaurant_id,
            party_size: parameters.party_size,
            checkedin_at: new Date().toMysqlFormat()
          };
          db.con.query('INSERT INTO parties SET ?', partyParameters, function (err, party) {
            if (err) {
              return db.con.rollback(function () {
                reject(err);
              });
            }
            var partyParticipantsParameters = {
              party_id: party.insertId,
              user_id: parameters.user_id
            };
         
            db.con.query('INSERT INTO party_participants SET ?', partyParticipantsParameters, function(err) {
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
                party.participants = [partyParticipantsParameters];
                resolve(party);
              });
            });
          });
        });
      });
    },
    seatParty: function (parameters) {
      /* seats a party, and assignes it to a table, changing the status of the table
      expected parameters: party_id, table_id */
      return new Promise(function (resolve, reject) {
        db.con.beginTransaction(function (err) {
          if (err) { reject(err); }
          var partyParameters = {
            table_id: parameters.table_id,
            seated_at: new Date().toMysqlFormat()
          }; 
          db.con.query('UPDATE parties SET ? WHERE party_id = ?', [partyParameters, parameters.party_id], function (err, party) {
            if (err) {
              return db.con.rollback(function () {
                reject(err);
              });
            }
            db.con.query('UPDATE tables SET available = FALSE WHERE id = ?', parameters.table_id, function(err) {
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
                resolve(party);
              });
            });
          });
        });
      });
    }
  },
  order: {
    orderMenuItems: function() {
    /*writes the orders in the DB to the party
    expected parameters: party_id, and menu_items (an array of menu_items with menu_item_id and quantity) */

    }
  }
};

