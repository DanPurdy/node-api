const User = require('../models/user');

module.exports.decodeUser = (token) => {
  if (token) {
    const decoded = JSON.parse(new Buffer(token.split(' ')[1].split('.')[1], 'base64').toString());
    return User.findOne({ _id: decoded.user._id }, (err, user) => (
      user
    ));
  }
  return Promise.resolve({});
};
