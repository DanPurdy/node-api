const config = require('../../config/settings');
const express = require('express');
const jwt = require('jwt-simple');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

const getToken = (headers) => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    }
    return null;
  }
  return null;
};

router.get('/list', passport.authenticate('jwt', { session: false }), (req, res) => {
  const token = getToken(req.headers);
  if (token) {
    const decoded = jwt.decode(token, config.secret);
    return User.findOne({ name: decoded.user.name }, (err, user) => {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      return res.json({ success: true, msg: `Welcome to the member area ${user.name}!` });
    });
  }
  return res.status(403).send({ success: false, msg: 'No token provided.' });
});

module.exports = router;
