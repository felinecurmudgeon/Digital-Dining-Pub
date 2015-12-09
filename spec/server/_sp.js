var db = require('../../server/sql-db/index.js');
var supertest = require('supertest');
request = supertest('http://localhost:8000');
var ps = require('ps-node');
 
ps.lookup({
    command: 'node',
    }, function(err, resultList ) {
      if (err) {
        console.log(err);
      }
      if(!resultList.length){
        var server = require('../../server/server.js');
      }
  });

describe("Restaurant Users API suite", function() {

  it("Should be able to save a restaurant user", function (done){
    
    var testRestaurantUser = {
      username: "Timmy",
      password: "12345"
    };

    request.post('/api/restaurantUsers')
      .send(testRestaurantUser)
      .expect(201)
      .end(function (err, res){
          if (err) {
            done.fail(err);
          } else {
            console.log("/restaurantsUsers POST run");
            db.con.query('SELECT * FROM restaurant_users WHERE username="Timmy"', function (err, data){
              expect(data[0].username).toBe('Timmy');
              db.con.query("DELETE FROM restaurant_users WHERE username='Timmy'", function (err, data){
                if(err){
                  console.log(err);
                }
              });
            });
            done();
          }
      });  
  
   });

  it("Should be able to get a restaurant user", function (done){
    db.con.query('INSERT INTO restaurant_users (username, password) VALUES ("Kimmy","54321")', function (err, data){
      if(err){
        console.log(err);
      }
      request.get('/api/restaurantUsers')
        .expect(200)
        .end(function (err, res){
            if (err) {
              done.fail(err);
            } else {
              console.log("/restaurantsUsers GET run");
              expect(res.body.data[res.body.data.length-1].attributes.username).toBe("Kimmy");
              db.con.query("DELETE FROM restaurant_users WHERE username='Kimmy'");
              done();
            }
        });  
    })
   });
  });


describe("Restaurant API suite", function() {

  var testRestaurant = {
    restaurant_name: "Timmy's Tacos",
    restaurant_owner_id: 0,
    restaurant_address: "123 Main St.",
    restaurant_city: "Tuscon", 
    restaurant_state: "AZ", 
    restaurant_zip_code: "75104"
  };

  beforeAll(function (done) {
    db.con.query("INSERT INTO restaurant_users (username, password) VALUES ('Quimby','54321')", function (err, data){
      if (err){
        console.log(err);
        done();
      } else {
        testRestaurant.restaurant_owner_id = data.insertId;
        done();
      }
    });
  });

  it("Should be able to save a restaurant", function (done){
    request.post('/api/restaurants')
      .send(testRestaurant)
      .expect(201)
      .end(function (err, res){
          if (err) {
            done.fail(err);
          } else {
            console.log("/restaurants POST run");
            db.con.query('SELECT * FROM restaurants WHERE restaurant_address="123 Main St."', function (err, data){
              expect(data[0].restaurant_address).toBe('Timmy');
              db.con.query("DELETE FROM restaurants WHERE restaurant_address='123 Main St.'", function (err, data){
                if(err){
                  console.log(err);
                }
              });
            });
            done();
          }
      });  
   });

  it("Should be able to get a restaurant", function (done){
    db.con.query('INSERT INTO restaurants SET ?', testRestaurant, function (err, data){
      if(err){
        console.log(err);
      } else {
        console.log(data);
        request.get('/api/restaurants')
          .expect(200)
          .end(function (err, res){
              if (err) {
                done.fail(err);
              } else {
                console.log("/restaurants GET run");
                console.log(res.body);
                expect(res.body.data[res.body.data.length-1].attributes.restaurantAddress).toBe("123 Main St.");
                db.con.query("DELETE FROM restaurants WHERE restaurant_address='123 Main St.'");
                done();
              }
          }); 
        }
      })
   });

  afterAll(function (done) {
    db.con.query("DELETE FROM restaurant_users WHERE username='Quimby'", function (err, data){
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
