const express = require('express');
const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../../config/settings'); // get db config file
const jwtConfig = require('../../config/jwt').jwtConf;

const router = express.Router();

router.post('/signup', (req, res) => {
  if (!req.body.name || !req.body.password) {
    return res.json({ success: false, msg: 'Please pass name and password.' });
  }
  const newUser = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
  });
  return newUser.save((err) => {
    if (err) {
      return res.json({ success: false, msg: 'Username already exists.' });
    }
    return res.json({ success: true, msg: 'Successful created new user.' });
  });
});

router.post('/authenticate', (req, res) => {
  User.findOne({ name: req.body.name }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.send({ success: false, msg: 'Authentication failed. User not found.' });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, (passErr, isMatch) => {
        if (isMatch && !passErr) {
          const payload = {
            aud: jwtConfig.audience,
            iss: jwtConfig.issuer,
            iat: jwtConfig.issuedAt(),
            exp: jwtConfig.expiresIn(jwtConfig.issuedAt()),
            user: {
              name: user.name,
              email: user.email,
              password: null,
              role: user.role,
            },
          };
          const token = jwt.encode(payload, config.secret);
          return res.json({ success: true, token: `JWT ${token}` });
        }
        return res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
      });
    }
  });
});

module.exports = router;
