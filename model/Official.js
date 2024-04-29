const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
    maxlength: [128, 'Password must be less than 128 characters long'],
  }
},{
 timestamps: true 
});
UserSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password') || user.isNew) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
      } catch (err) {
        return next(err);
      }
    } else {
      return next();
    }
  });
  UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };
  UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
  };
  UserSchema.statics.findByToken = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.findOne({ _id: decoded._id });
  } catch (err) {
    throw new Error(`Error verifying token: ${err.message}`);
  }
};
const User = mongoose.model('Official', UserSchema);
module.exports = User;