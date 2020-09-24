/* ------------------ DB Initialization ----------------- */

const dotenv = require("dotenv").config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bcrypt = require('bcrypt');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose connection error:'));
db.once('open', () => {
  console.log('Successfully connect to MongoDB.');
  
  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    suburb: String
  }); // define userSchema
  
  const User = mongoose.model('User', userSchema);
  
  User.deleteMany({}, (err, result) => {
    if (err) return console.log('Failed to delete users', err);
    insertUsers(User);
  }); // insertUsers
  
}); // Mongoose connection

/* ---------------- insertUsers function ---------------- */

const insertUsers = (User) => {
  const users = [
    {
      name: 'Andy',
      email: 'andy@ga.co',
      password: bcrypt.hashSync('chicken', 10),
      suburb: 'Casula'
    },
    {
      name: 'Peter',
      email: 'peter@ga.co',
      password: bcrypt.hashSync('chicken', 10),
      suburb: 'Penrith'
    },
    {
      name: 'Kate',
      email: 'kate@ga.co',
      password: bcrypt.hashSync('chicken', 10),
      suburb: 'West Ryde'
    }
  ]; // users array
  User.insertMany(users, (err, result) => {
    if (err) return console.log('Error adding users', err);
    User.countDocuments({}, (err, count) => {
      if(err) return console.log(err);
      console.log('Total users: ', count);
      process.exit(0); // quit the program
    }); // User.countDocuments
  }); // User.insertMany
}; // insertUsers