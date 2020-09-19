const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  suburb: String
}); // define userSchema

const User = mongoose.model('User', userSchema);

module.exports = User;