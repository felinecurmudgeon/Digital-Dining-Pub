module.exports = function () {
  this.type = "";
  this.id = 0;
  this.attributes = {};
  this.relationships = {}; //format should be data.type = data: [{"type": type, "id": id}, {"type": type, "id": id}]; - lookup for each should be in the included property of the main JsonResponseObject
  this.links = {};
};
