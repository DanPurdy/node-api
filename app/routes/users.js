const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const sanitize = require('../utils/user');

const router = express.Router();

// Unprotected Route
router.post('/register', (req, res) => {
  console.log(req.body);
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ success: false, msg: 'Please pass username and password.' });
  }
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  return newUser.save((err) => {
    if (err) {
      return res.status(400).json({ success: false, msg: 'This user already exists.' });
    }
    return res.status(201).json({ success: true, msg: 'Successfully created new user.' });
  });
});

router.get('/user', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  User.findOne({ username: req.user.username }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'Authentication failed. User not found.' });
    }
    return res.status(200).json(sanitize(user));
  });
});

router.post('/check', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let query = Object.create(null);
  if (req.body.parameter === 'username') {
    query = { username: req.body.value };
  } else if (req.body.parameter === 'email') {
    query = { email: req.body.value };
  } else {
    return res.status(400).json({ error: 'You must specify the correct parameters' });
  }
  return User.findOne(query, (err, user) => {
    if (err) next(err);
    if (user) {
      return res.status(200).json({ success: true, exists: true });
    }
    return res.status(200).json({ success: true, exists: false });
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
