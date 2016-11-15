const User = require('../models/user');

module.exports.decodeUser = (token) => {
  // token will be a string of null if it doesn't exist
  if (token && token !== 'null') {
    const decoded = JSON.parse(new Buffer(token.split(' ')[1].split('.')[1], 'base64').toString());
    return User.findOne({ _id: decoded.user._id }, (err, user) => (
      user
    ));
  }
  return Promise.resolve({});
};
