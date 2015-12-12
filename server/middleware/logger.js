module.exports = function (req, res, next) {
  if (req.user) {
    console.log('Received ' + req.method + ' request to ' + req.url + ' from user ' + req.user.username);
  } else {
    console.log('Received ' + req.method + ' request to ' + req.url + ' from unauthenticated user');
  }
  next();
};
