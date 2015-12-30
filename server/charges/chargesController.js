/*jshint camelcase: false */
var stripe = require('stripe')(process.env.STRIPESECRET);
var usersModel = require('../users/usersModel.js');
var menuItems = require('../orders/ordersModel.js').order;

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
  },

  pay : function (req, res) {
    var chargeCard = function (amt, userId) {
    // Get the amount submitted by the form
      var amount = Math.round(amt * 100);
      console.log(amount);

      //look up current cust, get stripe id
      return usersModel.user.get(userId)
        .then(function (user) {
          if (user[0].stripe_id) {
            //charge
            //TODO: update user account with payment history info
            return stripe.charges.create({
              amount: amount, // amount in cents
              currency: 'usd',
              customer: user[0].stripe_id // from DB
            });
          } else {
            throw 'no stripe ID';
          }
        });
    };
    console.log('req is ', req.body);
    chargeCard(req.body.total, req.user.id).then(function () {
      var itemsToUpdate = [];
      for (var i = 0; i < req.body.items.length; i++) {
        itemsToUpdate[i] = {};
        itemsToUpdate[i].id = req.body.items[i].id;
        itemsToUpdate[i].total_paid = +req.body.items[i].totalPaid;
        if (+req.body.items[i].price === +req.body.items[i].payAmount) {
          itemsToUpdate[i].paid_at = new Date().toMysqlFormat();
        }
      }
      menuItems.batchPut(itemsToUpdate).then( function () {
        res.sendStatus(201);
      })
      .catch(function (err) {
        console.log('batchPut failed: ', err);
        res.status(400);
        res.send('error updating DB');
      });
    })
    .catch(function (err) {
      console.log('charge failed: ', err);
      res.status(400);
      res.send('no credit card on file');
    });
  }
};
