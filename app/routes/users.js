const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const sanitize = require('../utils/user');
const jwtUser = require('../utils/jwt').decodeUser;

const updateDoc = require('../utils/update');

const router = express.Router();

// ==============================================================================
//  Unprotected Routes
// ==============================================================================

router.post('/register', (req, res) => {
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

router.post('/check', (req, res, next) => {
  // Extract the token if it exists so we can check existing users too
  const token = req.headers.authorization;
  let currentUser = {};
  jwtUser(token)
    .then((curUser) => {
      currentUser = curUser;
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
        // return true if the username is used elsewhere BUT is not our current users name.
        if (user) {
          if (currentUser && currentUser[req.body.parameter] === user[req.body.parameter]) {
            return res.status(200).json({ success: true, exists: false });
          }
          return res.status(200).json({ success: true, exists: true });
        }
        return res.status(200).json({ success: true, exists: false });
      });
    }).catch((e) => {
      next(e);
    });
});


// ==============================================================================
//  Protected routes
// ==============================================================================

router.get('/user', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  User.findOne({ username: req.user.username }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'Authentication failed. User not found.' });
    }
    return res.status(200).json(sanitize(user));
  });
});

router.get('/:userId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user._id.toString() === req.params.userId) {
    return User.findOne({ username: req.user.username }, (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(404).json({ success: false, msg: 'Authentication failed. User not found.' });
      }
      return res.status(200).json(sanitize(user));
    });
  }
  return res.status(403).json({ success: false, msg: 'You are not authorised to request this resource' });
});

router.put('/:userId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user._id.toString() === req.params.userId) {
    return User.findOne({ _id: req.params.userId }, (err, user) => {
      updateDoc.updateDocument(user, User, req.body);
      user.save((error) => {
        if (error) next(error);
        return res.status(200).json(sanitize(user));
      });
    });
  }
  return res.status(403).json({ success: false, msg: 'Not Authorized' });
});

module.exports = router;
