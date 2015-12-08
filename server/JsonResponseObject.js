//this API response pattern is from the specification defined at http://jsonapi.org/
module.exports = function () {
  this.links = {};
  this.data = []; //should be an array of JsonDataObjects
  this.included =[]; //should be an array of JsonDataObjects
};
