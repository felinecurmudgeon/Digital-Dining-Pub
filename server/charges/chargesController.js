/*jshint camelcase: false */
var stripe = require('stripe')(process.env.STRIPESECRET);
var usersModel = require('../users/usersModel.js');
// var menuItems = require('../orders/ordersModel.js').order;

module.exports = {
  chargeCard : function (req, res) {

    // Get the amount submitted by the form
    var amount = Math.round(req.body.amount * 100);
    console.log(amount);

    //look up current cust, get stripe id
    usersModel.user.get(req.user.id)
      .then(function (user) {
        if (user[0].stripe_id) {
          //charge
          //TODO: update user account with payment history info
          return stripe.charges.create({
            amount: amount, // amount in cents
            currency: 'usd',
            customer: user[0].stripe_id // from DB
          })
          .then(function () {
            console.log('sucessful charge ');
            res.sendStatus(201);
          });
        } else {
          res.status(400);
          res.send('no credit card on file');
        }
      });
  },

  createStripeCustomer : function (req, res) {
    // Get the credit card details submitted by the form
    var stripeToken = req.body.stripeToken;

    usersModel.user.get(req.user.id)
      .then(function (user) {
        return stripe.customers.create({
          source: stripeToken,
          description: 'created stripe payment id for user id ' + req.user.id
        }).then(function (stripeCustomer) {
          //save user
          user[0].stripe_id = stripeCustomer.id;
          usersModel.user.put(user[0].id, user[0]);
          console.log('card added');
          res.send(201);
        });
      });
  }

  // pay : function (req, res) {
  //   chargeCard(req.data.total, req.user.id).then(function () {
  //     var updatedItem = {};
  //     var updatePromises = [];
  //     for (var key in req.data){
  //       if (key !== 'total') {
  //         updatedItem.payAmount = req.data[key].payAmount;
  //         if (req.data[key].price === req.data[key].payAmount) {
  //           updatedItem.paid_at = new Date().toMysqlFormat();
  //         }

  //         updatePromises.push(menuItems.payAmount(updatedItem, key));

  //         //update the item paid amount in menu_items_ordered
  //         //if paid amount = price, timestamp the paid_at value
  //         //if all items are fully paid, tell the client?
  //       }
  //     }
  //   })
  //   .catch(function () {
  //     res.status(400);
  //     res.send('no credit card on file');
  //   });
  // }
};

// var chargeCard = function (amt, userId) {
// // Get the amount submitted by the form
//   var amount = Math.round(amt * 100);
//   console.log(amount);

//   //look up current cust, get stripe id
//   usersModel.user.get(userId)
//     .then(function (user) {
//       if (user[0].stripe_id) {
//         //charge
//         //TODO: update user account with payment history info
//         return stripe.charges.create({
//           amount: amount, // amount in cents
//           currency: 'usd',
//           customer: user[0].stripe_id // from DB
//         });
//       } else {
//         throw 'no stripe ID';
//       }
//     });
// };
