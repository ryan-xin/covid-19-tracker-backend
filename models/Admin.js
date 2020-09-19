const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  }],
}); // define adminSchema

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
