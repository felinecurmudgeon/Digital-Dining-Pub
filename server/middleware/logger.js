module.exports = function (req, res, next){
  console.log('Received ' + req.method + ' request to ' + req.url);
  next();
};
