const mongoose = require('mongoose');

const db = require('./models');

const bcrypt = require('bcrypt');

const createAdmin = (admin) => {
  return db.Admin.create(admin).then(newAdmin => {
    console.log('Admin created: ', newAdmin);
    return newAdmin;
  });
}; // createAdmin

const createCase = (adminId, cases) => {
  return db.Case.create(cases).then(newCase => {
    console.log('Case created', newCase);
    return db.Admin.findByIdAndUpdate(
      adminId,
      { $push: { cases: newCase._id } },
      { new: true, useFindAndModify: false }
    );
  });
}; // createCase

const getAdminWithPopulate = (id) => {
  return db.Admin.findById(id).populate("cases");
}; // getAdminWithPopulate

const run = async () => {
  var admin1 = await createAdmin({
    name: 'Ryan',
    email: 'ryan@ga.co',
    password: bcrypt.hashSync('chicken', 10),
  });
  admin1 = await createCase(admin1._id, {
    location: 'Lawson oval',
    suburb: 'Lawson',
    year: 2020,
    month: 'September',
    day: 13,
    startTime: '10:30am',
    endTime: '12:45pm',
    lat: -33.732720,
    lng: 151.005100
  });
  admin1 = await createCase(admin1._id, {
    location: 'Anytime Fitness',
    suburb: 'Casula',
    year: 2020,
    month: 'September',
    day: 11,
    startTime: '10:15am',
    endTime: '12:00pm',
    lat: -33.739480,
    lng: 150.960640
  });
  admin1 = await createCase(admin1._id, {
    location: 'Hunters Hill Bowling Club',
    suburb: 'Hunters Hill',
    year: 2020,
    month: 'September',
    day: 8,
    startTime: '6:50pm',
    endTime: '9:00pm',
    lat: -34.845480,
    lng: 150.740130
  });
  admin1 = await createCase(admin1._id, {
    location: 'Fitness First Maroubra',
    suburb: 'Maroubra',
    year: 2020,
    month: 'September',
    day: 5,
    startTime: '8:00am',
    endTime: '12:00pm',
    lat: -33.776230,
    lng: 150.932310
  });
  admin1 = await getAdminWithPopulate(admin1._id);
  console.log('Populated admin1', admin1);
  var admin2 = await createAdmin({
    name: 'David',
    email: 'david@ga.co',
    password: bcrypt.hashSync('chicken', 10),
  });
  admin2 = await createCase(admin2._id, {
    location: 'Eastwood Ryde Netball Association',
    suburb: 'West Ryde',
    year: 2020,
    month: 'September',
    day: 5,
    startTime: '12:15pm',
    endTime: '1:30pm',
    lat: -33.737474,
    lng: 150.917699
  });
  admin2 = await getAdminWithPopulate(admin2._id);
  console.log('Populated admin2', admin2);
  process.exit(0);
}; // run

/* ------------------ DB Initialization ----------------- */

const dotenv = require('dotenv').config();

mongoose
.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Successfully connect to MongoDB.'))
.catch(err => console.error('Connection error', err));

/* --------------------- Import Data -------------------- */

db.Admin.deleteMany({}, (err, result) => {
  if (err) return console.log('Failed to delete admins', err);
  db.Case.deleteMany({}, (err, result) => {
    if (err) return console.log("Failed to delete cases", err);
    run();
  }); // insertCases  
}); // insertAdmins