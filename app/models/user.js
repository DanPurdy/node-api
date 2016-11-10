const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  // Missing any sort of validation here - easiest hack in the world maybe? :D
  role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User',
  },
});

UserSchema.pre('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      return bcrypt.hash(this.password, salt, (hashErr, hash) => {
        if (hashErr) {
          return next(err);
        }
        this.password = hash;
        return next();
      });
    });
  }
});

UserSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    return cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
