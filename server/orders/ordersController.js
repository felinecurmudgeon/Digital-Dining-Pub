/*jshint camelcase: false */
var ordersModel = require('./ordersModel.js');
var JsonResponse = require('../JsonResponseObject.js');
var JsonData = require('../JsonDataObject.js');

var createJsonResponseForPartyItems = function (data) {
  var JsonResponseObject = new JsonResponse();
  for (var i = 0; i < data.length; i++) {
    var JsonDataObject = new JsonData();
    JsonDataObject.type = 'menuItemsOrdered';
    JsonDataObject.id = data[i].id;
    JsonDataObject.attributes = {
      restaurantId: data[i].restaurant_id,
      partyId: data[i].party_id,
      menuItemId: data[i].menu_item_id,
      quantity: data[i].quantity,
      totalPaid: data[i].total_paid,
      orderedAt: data[i].ordered_at,
      servedAt: data[i].served_at,
      paidAt: data[i].paid_at,
      canceledAt: data[i].canceled_at
    };
    JsonResponseObject.data.push(JsonDataObject);
  }
  return JsonResponseObject;
};

module.exports = {
  getItemsOrdered: function (req, res) {
    ordersModel.order.get(req.params.pid)
      .then(function (data) {
        var response = createJsonResponseForPartyItems(data);
        res.status(200);
        res.send(response);
      });
  },
  postItemsOrdered: function (req, res) { // expecting an array of items in the body
    ordersModel.order.post({user_id: 95, party_id: req.params.pid,
      menu_items: req.body})
      .then(function (data) {
        res.status(201);
        res.send(data);
      });
  },
  deleteItemsOrdered : function (req, res) {
    ordersModel.order.delete(req.params.mid)
      .then(function (data) {
        res.status(204);
        res.send(data);
      });
  }
};
