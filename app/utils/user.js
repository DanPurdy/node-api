const sanitize = function (user) {
  const updatedUser = user.toObject();
  delete updatedUser.__v;
  delete updatedUser.password;
  return updatedUser;
};

module.exports = sanitize;
