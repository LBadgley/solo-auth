const mongoose = require('mongoose');
const { hash, compare } = require('../utils/hash');
const { tokenize, untokenize } = require('../../lib/utils/token');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: String
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.passwordHash;
      delete ret.__v;
    }
  }
});

userSchema.virtual('pw').set(function(pwText) {
  this._tempPassword = pwText;
});
// because I am lady
userSchema.virtual('password').set(function(pwText) {
  this._tempPassword = pwText;
});

userSchema.pre('save', function(next) {
  hash(this._tempPassword)
    .then(hashedPassword => {
      this.passwordHash = hashedPassword;
      next();
    });
});
userSchema.methods.compare = function(password) {
  return compare(password, this.passwordHash);
};
userSchema.methods.authToken = function() {
  return tokenize(this.toJSON());
};
userSchema.statics.findByToken = function(token) {
  return Promise.resolve(untokenize(token));
};

module.exports = mongoose.model('User', userSchema);
