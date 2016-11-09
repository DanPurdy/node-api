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

router.post('/authenticate', (req, res, next) => {
  User.findOne({ name: req.body.name }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      return res.send({ success: false, msg: 'Authentication failed. User not found.' });
    }
    // check if password matches
    return user.comparePassword(req.body.password, (passErr, isMatch) => {
      if (isMatch && !passErr) {
        const payload = {
          aud: jwtConfig.audience,
          iss: jwtConfig.issuer,
          iat: jwtConfig.issuedAt(),
          exp: jwtConfig.expiresIn(jwtConfig.issuedAt()),
          user,
        };
        const token = jwt.encode(payload, config.secret);
        return res.json({ success: true, token: `JWT ${token}` });
      }
      return res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
    });
  });
});

module.exports = router;
