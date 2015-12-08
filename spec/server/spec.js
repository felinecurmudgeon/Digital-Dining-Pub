var db = require('../../server/sql-db/index.js');
var supertest = require('supertest');
request = supertest('http://localhost:8000');

describe("Restaurant Users API suite", function() {

  it("Should be able to save a restaurant user", function (done){
    
    var testRestaurantUser = {
      username: "Timmy",
      password: "12345"
    };

    db.con.query("DELETE FROM restaurant_users WHERE username='Timmy'", function (err, data){
      if(err){
        console.log(err);
      } else {
      request.post('/api/restaurantUsers')
        .send(testRestaurantUser)
        .expect(201)
        .end(function (err, res){
            if (err) {
              done.fail(err);
            } else {
              console.log("/restaurantsUsers POST run");
              done();
            }
        });  
      }
    });
   });

  it("Should be able to get a restaurant user", function (done){
    request.get('/api/restaurantUsers')
      .expect(200)
      .end(function (err, res){
          if (err) {
            done.fail(err);
          } else {
            console.log("/restaurantsUsers GET run");
            expect(res.body.data[res.body.data.length-1].attributes.username).toBe("Timmy");
            db.con.query("DELETE FROM restaurant_users WHERE username='Timmy'");
            done();
          }
      });  
   });
  });


describe("Restaurant API suite", function() {
      /*creates a new restaurant; expected parameters: restaurant_name, restaurant_owner_id,
    restaurant_adress, restaurant_city, restaurant_state, restaurant_zip_code,
    and optional opening_hour_monday, closing_hour_monday, etc that default to 8am and 11pm*/
  var restaurantUser = {};

  beforeAll(function (done) {
    db.con.query("INSERT INTO restaurant_users (username, password) VALUES ('Timmer','54321')", function (err, data){
      if (err){
        console.log(err);
        done();
      } else {
        restaurantUser.id = data.insertId;
        done();
      }
    });
  });

  it("Should be able to save a restaurant", function (done){
    var testRestaurant = {
      restaurant_name: "Timmy's Tacos",
      restaurant_owner_id: restaurantUser.id,
      restaurant_address: "123 Main St.",
      restaurant_city: "Tuscon", 
      restaurant_state: "AZ", 
      restaurant_zip_code: "75104"
    };

    request.post('/api/restaurants')
      .send(testRestaurant)
      .expect(201)
      .end(function (err, res){
          if (err) {
            done.fail(err);
          } else {
            console.log("/restaurants POST run");
            done();
          }
      });  
   });

  it("Should be able to get a restaurant", function (done){
    request.get('/api/restaurants')
      .expect(200)
      .end(function (err, res){
          if (err) {
            done.fail(err);
          } else {
            console.log("/restaurants GET run");
            expect(res.body.data[res.body.data.length-1].attributes.restaurantAddress).toBe("123 Main St.");
            db.con.query("DELETE FROM restaurants WHERE restaurant_address='123 Main St.'");
            done();
          }
      });  
   });

  afterAll(function (done) {
    db.con.query("DELETE FROM restaurant_users WHERE username='Timmer'", function (err, data){
      if (err){
        console.log(err);
        done();
      } else {
        done();
      }
    });
  });

});

xdescribe("Menu item API suite", function() {

  xit("Should be able to save a menu item", function (done){
    var testMenuItem = {
      restaurant_id: 100,
      title: "Taco soup",
      description: "Dont knock it until you tried it",
      price: 3.99,
      menu_category_id: 100
    };

    request.post('/api/menus')
      .send(testMenuItem)
      .expect(201)
      .end(function(err,res){
        if (err) {
          done.fail(err);
        } else {
          console.log("Menu POST passed");
          done();
        }
      });
  });

  xit("Menu should return a valid response", function (done){
    request.get('/api/menus')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function(err,res){
        if (err) {
          done.fail(err);
        } else {
          console.log("Menu GET passed");
          done();
        }
      });
  });
});


describe("Parties API suite", function() {

  var testUser = {
    username: "Timmy",
    password: "12345"
  };

  beforeEach(function (done) {
    db.con.query("DELETE FROM users WHERE username='Timmy'", function (err, data){
      if(err){
        console.log(err);
      } else {
        db.con.query("INSERT INTO users SET ?", testUser, function (err, data){
          if(err){
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

