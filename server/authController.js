var jwt = require('jsonwebtoken');

module.exports = {
  authenticate: function (req, res) {
    if (true) {
      var profile = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        id: 123
      };

      var token = jwt.sign(profile, 'feline', { expiresInMinutes: 60 * 5 });

      res.json({ token: token });
    } else {
      res.send(401, 'Wrong user or password');
      return;
    }
  }
};