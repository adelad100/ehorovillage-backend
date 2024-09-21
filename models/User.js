// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Check if the User model already exists to prevent OverwriteModelError
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: '', // Path to profile picture
  },
  bio: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Use mongoose.models to check if the model is already compiled
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
