const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const sanitize = require('../utils/user');

const router = express.Router();

router.get('/user', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  User.findOne({ name: req.user.name }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(404).send({ success: false, msg: 'Authentication failed. User not found.' });
    }
    return res.json(sanitize(user));
  });
});

router.put('/user', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user._id.toString() === req.body._id) {
    return User.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body },
      { new: true },
      (err, user) => {
        if (err) return next(err);
        if (!user) {
          return res.status(404).send({ success: false, msg: 'User not found.' });
        }
        return res.json(sanitize(user));
      });
  }
  return res.status(403).send({ success: false, msg: 'Not Authorized' });
});

module.exports = router;
