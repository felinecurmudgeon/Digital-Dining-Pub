var db = require('../../server/sql-db/index.js');
var supertest = require('supertest');
request = supertest('http://localhost:8000');

describe("Parties API suite", function() {

  var testUser = {
    username: "Timmy",
    password: "12345"
  };

  beforeEach(function (done) {
    db.con.query("DELETE FROM users WHERE username='Timmy'", function (err, data){
      if (err){
        console.log(err);
      } else {
        db.con.query("INSERT INTO users SET ?", testUser, function (err, data){
          if (err){
            console.log(err);
          } else {
            testUser.id = data.insertId;
            done();
          }
        });
      }
    });
  });

  it("Should be able to checkin a user and create the party", function (done){
    var partyInfo = {
      restaurant_id: 1,
      party_size: 5,
      user_id: testUser.id
    };

    request.post('/api/parties')
      .send(partyInfo)
      .expect(201)
      .end(function(err, res) {
        if (err) {
          done.fail(err);
        } else {
          done();
        }
      });
  });
});
