var supertest = require('supertest');
request = supertest('http://localhost:8000');

describe("API suite", function() {

  it("Menu should return a valid response", function (done){
    request.get('/api/menus')
      .expect(200)
      .expect("stub success") //TODO: check for actual response
      .end(function(err,res){
        if (err) {
          done.fail(err);
        } else {
          console.log("Menu GET passed");
          done();
        }
      });
  });

  it("Restaurants should return a valid response", function (done){
    request.get('/api/restaurants')
      .expect(200)
      .expect("stub success") //TODO: check for actual response
      .end(function(err,res){
        if (err) {
          done.fail(err);
        } else {
          console.log("Restaurants GET passed");
          done();
        }
      });
  });
});
