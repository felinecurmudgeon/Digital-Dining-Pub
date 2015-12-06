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
              console.log("Restaurants User POST passed");
              done();
            }
          });  
      }
    });
   });

  it("Should be able to save a restaurant user", function (done){

  request.get('/api/restaurantUsers')
    .expect(200)
    // TODO: fix expect response to match API response
    // .expect([{
    //     username: 'Timmy'
    //   }])
    .end(function (err, res){
        if (err) {
          done.fail(err);
        } else {
          console.log("Restaurants User GET passed");
          done();
        }
      });  
   });
  });


xdescribe("Restaurant API suite", function() {
      /*creates a new restaurant; expected parameters: restaurant_name, restaurant_owner_id,
    restaurant_adress, restaurant_city, restaurant_state, restaurant_zip_code,
    and optional opening_hour_monday, closing_hour_monday, etc that default to 8am and 11pm*/

  xit("Should be able to save a restaurant", function (done){
    var testRestaurant = {
      restaurant_name: "Timmy's Tacos",
      restaurant_owner_id: 1,
      restaurant_adress: "123 Main St.",
      restaurant_city: "Tuscon", 
      restaurant_state: "AZ", 
      restaurant_zip_code: "75104"
    };

    request.post('/api/restaurant')
      .expect(201)
      .send(testRestaurant)
      .end(function (err, res){
          if (err) {
            done.fail(err);
          } else {
            console.log("Restaurants POST passed");
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
          console.log("Menu GET passed");
          done();
        }
      });
  });

  xit("Menu should return a valid response", function (done){
    request.get('/api/menus')
      .expect(200)
      .expect('Content-Type', 'application/json')
      //.expect("stub success") //TODO: check for actual response
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
