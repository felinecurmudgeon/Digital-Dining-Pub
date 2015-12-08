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
    checkInAndCreateParty: function(parameters) {
    /*creates a new party; expected parameters: restaurant_id, party_size, user_id, checkedin_at
    and creates the corresponding particpant in party_participants
    All of this is ine one SQL transaction*/
      var partyParameters = {
        restaurant_id: parameters.restaurant_id,
        party_size: parameters.party_size,
        checkedin_at: new Date().toMysqlFormat()
      };
      return new Promise(function (resolve, reject) {
        db.con.beginTransaction(function(err) {
          if (err) { reject(err); }
          db.con.query('INSERT INTO parties SET ?', partyParameters, function(err, party) {
            if (err) {
              return db.con.rollback(function() {
                reject(err);
              });
            }
            console.log(party, party.insertId);
            var partyParticipantsParameters = {
              party_id: party.insertId,
              user_id: parameters.user_id
            };
         
            db.con.query('INSERT INTO party_participants SET ?', partyParticipantsParameters, function(err) {
              if (err) {
                return db.con.rollback(function() {
                  reject(err);
                });
              }  
              db.con.commit(function(err) {
                if (err) {
                  return db.con.rollback(function() {
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
    }
  }
};

