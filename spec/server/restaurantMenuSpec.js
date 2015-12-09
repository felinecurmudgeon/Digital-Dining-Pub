var db = require('../../server/sql-db/index.js');
var supertest = require('supertest');
request = supertest('http://localhost:8000');
var ps = require('ps-node');


ps.lookup({
    command: 'node',
    }, function(err, resultList ) {
      if(!resultList.length){
         var server = require('../../server/server.js');
      }
      // resultList.forEach(function(result){
      //   ps.kill(result.pid);
      // })
  });

describe('Restaurant and Menu Test Suite', function() {

  var testRestaurant = {
    restaurant_name: 'Kimmys Tacos',
    restaurant_owner_id: 0,
    restaurant_address: '1234 Maple St.',
    restaurant_city: 'Tuscon', 
    restaurant_state: 'AZ', 
    restaurant_zip_code: '75104'
  };

  beforeAll(function (done) {
    db.con.query('DELETE FROM restaurants', function (err, data){
      db.con.query('DELETE FROM restaurant_users', function (err, data){
          db.con.query('INSERT INTO restaurant_users (username, password) VALUES ("Sarah","54321")', function (err, data){
              testRestaurant.restaurant_owner_id = data.insertId;
              db.con.query('INSERT INTO restaurants SET ?', testRestaurant, function (err, data){
                console.log('inserted test data');
                done();
              });
          });
      });
    });
  });

  ///////////////////////////////////////////
  ////////////RESTAURANT USER TESTS//////////
  ///////////////////////////////////////////

  describe('Restaurant User API Suite', function() {
    it('Should be able to get a restaurant user', function (done){
      request.get('/api/restaurantUsers')
        .expect(200)
        .end(function (err, res){
            if (err) {
              done.fail(err);
            } else {
              console.log('/restaurantsUsers GET run');
              expect(res.body.data[res.body.data.length-1].attributes.username).toBe('Sarah');
              done();
            }
        });  
    });


    it('Should be able to save a restaurant user', function (done){
      var testUserPost = {
        username: 'Jimmy',
        password: '1234'
      };

      request.post('/api/restaurantUsers')
        .send(testUserPost)
        .expect(201)
        .end(function (err, res){
          if (err) {
            done.fail(err);
          } else {
            console.log('/restaurantsUsers POST run');
            db.con.query('SELECT * FROM restaurant_users WHERE username="Jimmy"', function (err, data){
              expect(data[0].username).toBe('Jimmy');
              db.con.query('DELETE FROM restaurant_users WHERE username="Jimmy"', function (err, data){
                if(err){
                  console.log(err);
                }
                done();
              });
            });
          }
        });
    });
   //test closer
  });

  ///////////////////////////////////////////
  ////////////RESTAURANT TESTS///////////////
  ///////////////////////////////////////////

  describe('Restaurant API Suite', function() {
      it('Should be able to get a restaurant', function (done){
        request.get('/api/restaurants')
          .expect(200)
          .end(function (err, res){
              if (err) {
                done.fail(err);
              } else {
                console.log('/restaurants GET run');
                expect(res.body.data[res.body.data.length-1].attributes.restaurantAddress).toBe('1234 Maple St.');
                done();
              }
          });  
      });

      it('Should be able to save a restaurant user', function (done){
        var testRestaurantPost = {
          restaurant_name: 'Carls Cake',
          restaurant_owner_id: testRestaurant.restaurant_owner_id,
          restaurant_address: '1234 Pine St.',
          restaurant_city: 'Tuscon', 
          restaurant_state: 'AZ', 
          restaurant_zip_code: '75111'
        };

        request.post('/api/restaurants')
          .send(testRestaurantPost)
          .expect(201)
          .end(function (err, res){
            if (err) {
              done.fail(err);
            } else {
              console.log('/restaurants POST run');
              db.con.query('SELECT * FROM restaurants WHERE restaurant_address="1234 Pine St."', function (err, data){
                expect(data[0].restaurant_address).toBe('1234 Pine St.');
                db.con.query('DELETE FROM restaurants WHERE restaurant_address="1234 Pine St."', function (err, data){
                  if(err){
                    console.log(err);
                  }
                  done();
                });
              });
            }
          });
      });
     //test closer
    });


//Suite closer
});







