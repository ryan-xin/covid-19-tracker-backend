/* ------------------ DB Initialization ----------------- */

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/covid19', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose connection error:'));
db.once("open", function () {
  console.log('Mongoose connected');
}); // Mongoose connection

/* ------------ Express Server Initialization ----------- */

const express = require('express');
const server = express();
const PORT = 1337;

// Enable support for JSON-encoded request bodies(i.e. posted form data)
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Use cors as Express middleware, i.e. se the CORS allow header
const cors = require('cors');
server.use(cors());

// For checking password when login
const bcrypt = require('bcrypt');

// For creating signed login tokens to send to the frontend
const jwt = require('jsonwebtoken');

// For decoding/checking JWT tokens in the header of requests 
const jwtAuthenticate = require('express-jwt');

// TODO: Move this out of server file, into .env or .bash_profile etc
const SERVER_SECRET_KEY = 'covid19TrackerSecretKey';

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});