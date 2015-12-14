var jwt = require('jsonwebtoken');
var url = require('url');

var unprotectedEndpoints = ['/api/signin', '/api/signup', '/api/auth/facebook', '/api/auth/callback'];
var protectEndpoints = false;  //for development purposes.  Eventually we need to make this true

module.exports = function (req, res, next) {
  var protectedRoute = (unprotectedEndpoints.indexOf(url.parse(req.url).pathname) === -1);
  //OPTIONS is just for cors
  if (req.method === 'OPTIONS') {
    next();
  } else {
    jwt.verify(req.headers.authorization, process.env.DDJWTSECRET, function (err, profile) {
      if (err && (protectedRoute && protectEndpoints)) {
        res.status(401).send('invalid token');
      } else if (!err) {
        req.user = {};
        req.user.username = profile.username;
        req.user.id = profile.userID;
        next();
      } else {
        next();
      }
    });
  }
};
