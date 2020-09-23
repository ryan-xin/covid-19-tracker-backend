const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  location: String,
  suburb: String,
  year: Number,
  month: String,
  day: Number,
  startTime: String,
  endTime: String,
  lat: Number,
  lng: Number,
  createdAt: { type: Date, default: Date.now },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
}); // define caseSchema

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;