/*jshint camelcase: false */
var stripe = require('stripe')(process.env.STRIPESECRET);
var usersModel = require('../users/usersModel.js');

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
};
