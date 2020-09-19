const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  location: String,
  suburb: String,
  year: Number,
  month: String,
  day: Number,
  startTime: String,
  endTime: String,
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, {
  timestamps: true
}); // define caseSchema

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;