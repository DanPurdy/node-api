const express = require('express');
const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../../config/settings'); // get db config file
const jwtConfig = require('../../config/jwt').jwtConf;
const sanitize = require('../utils/user');

const router = express.Router();

router.post('/authenticate', (req, res, next) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      return res.status(400).json({ success: false, msg: 'Authentication failed. User not found.' });
    }
    // check if password matches
    return user.comparePassword(req.body.password, (passErr, isMatch) => {
      if (isMatch && !passErr) {
        const payload = {
          aud: jwtConfig.audience,
          iss: jwtConfig.issuer,
          iat: jwtConfig.issuedAt(),
          exp: jwtConfig.expiresIn(jwtConfig.issuedAt()),
          user: sanitize(user),
        };
        const token = jwt.encode(payload, config.secret);
        return res.status(200).json({ success: true, token: `JWT ${token}` });
      }
      return res.status(403).send({ success: false, msg: 'Authentication failed. Wrong password.' });
    });
  });
});

module.exports = router;
