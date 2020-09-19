/* ------------------ DB Initialization ----------------- */

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/covid19', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bcrypt = require('bcrypt');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose connection error:'));
db.once("open", () => {
  console.log('Mongoose connected');
  
  const adminSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,
    cases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case",
      },
    ],
  }); // define adminSchema
  
  const Admin = mongoose.model('Admin', adminSchema);
  
  Admin.deleteMany({}, (err, result) => {
    if (err) return console.log("Failed to delete admins", err);
    insertAdmins(Admin);
  }); // insertAdmins
  
}); // Mongoose connection

/* ---------------- insertAdmins function --------------- */

const insertAdmins = (Admin) => {
  const admins = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Ryan",
      email: "ryan@ga.co",
      password: bcrypt.hashSync("chicken", 10),
      cases: [],
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "David",
      email: "david@ga.co",
      password: bcrypt.hashSync("chicken", 10),
      cases: [],
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Allen",
      email: "allen@ga.co",
      password: bcrypt.hashSync("chicken", 10),
      cases: [],
    },
  ]; // admins array
  Admin.insertMany(admins, (err, result) => {
    if (err) return console.log('Error adding admins', err);
    Admin.countDocuments({}, (err, count) => {
      if (err) return console.log(err);
      console.log("Total admins: ", count);
      process.exit(0); // quit the program
    }); // Admin.countDocuments
  }); // Admin.insertMany
}; // insertAdmins