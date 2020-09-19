/* ------------------ DB Initialization ----------------- */

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/covid19', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose connection error:'));
db.once('open', () => {
  console.log('Mongoose connected');
  
  const caseSchema = new mongoose.Schema(
    {
      location: String,
      suburb: String,
      year: Number,
      month: String,
      day: Number,
      startTime: String,
      endTime: String,
      admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    },
    { timestamps: true }
  ); // define caseSchema
  
  const Case = mongoose.model('case', caseSchema);
  
  Case.deleteMany({}, (err, result) => {
    if (err) return console.log("Failed to delete cases", err);
    insertCases(Case);
  }); // insertCases
  
}); // Mongoose connection

/* ---------------- insertCases function ---------------- */

const insertCases = (Case) => {
  const cases = [
    {
      location: 'Lawson oval',
      suburb: 'Lawson',
      year: 2020,
      month: 'September',
      day: 13,
      startTime: '10:30am',
      endTime: '12:45pm'
    },
    {
      location: 'Anytime Fitness',
      suburb: 'Casula',
      year: 2020,
      month: 'September',
      day: 11,
      startTime: '10:15am',
      endTime: '12pm'
    },
    {
      location: 'Hunters Hill Bowling Club',
      suburb: 'Hunters Hill',
      year: 2020,
      month: 'September',
      day: 8,
      startTime: '6:50pm',
      endTime: '9pm'
    },
    {
      location: 'Fitness First Maroubra',
      suburb: 'Maroubra',
      year: 2020,
      month: 'September',
      day: 5,
      startTime: '8am',
      endTime: '12pm'
    },
    {
      location: 'Eastwood Ryde Netball Association',
      suburb: 'West Ryde',
      year: 2020,
      month: 'September',
      day: 5,
      startTime: '12:15pm',
      endTime: '1:30pm'
    },
    {
      location: 'Rouse Hill Town Centre',
      suburb: 'Rouse Hill',
      year: 2020,
      month: 'September',
      day: 5,
      startTime: '12:30pm',
      endTime: '1:30pm'
    },
  ]; // cases array
  Case.insertMany(cases, (err, result) => {
    if (err) return console.log("Error adding cases", err);
    Case.countDocuments({}, (err, count) => {
      if (err) return console.log(err);
      console.log("Total cases: ", count);
      process.exit(0); // quit the program
    }); // Case.countDocuments
  }); // case.insertMany
}; // insertCases