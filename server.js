/* ------------------ DB Initialization ----------------- */

const mongoose = require('mongoose');


mongoose
.connect('mongodb://127.0.0.1:27017/covid19', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Successfully connect to MongoDB.'))
.catch(err => console.error('Connection error', err));

// const db = require('./models');
const db = mongoose.connection;

/* ------------ Express Server Initialization ----------- */

const express = require('express');
const app = express();
const PORT = 1337;

// Enable support for JSON-encoded request bodies(i.e. posted form data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use cors as Express middleware, i.e. se the CORS allow header
const cors = require('cors');
app.use(cors());

// For checking password when login
const bcrypt = require('bcrypt');

// For creating signed login tokens to send to the frontend
const jwt = require('jsonwebtoken');

// For decoding/checking JWT tokens in the header of requests 
const jwtAuthenticate = require('express-jwt');

// TODO: Move this out of server file, into .env or .bash_profile etc
const SERVER_SECRET_KEY = 'covid19TrackerSecretKey';

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

// Use this function to lock down any route that should be for logged-in users only
const checkAuth = () => {
  // Check authentication for this route, i.e. logged-in users only
  return jwtAuthenticate({
    secret: SERVER_SECRET_KEY,
    algorithms: ['HS256']
  });
};

/* ----------------------- Routes ----------------------- */

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to covid-19 tracker.' });
});

app.post('/user/login', (req, res) => {
  console.log('User login data', req.body);
  // res.json(req.body); // echo back the POSTed form data
  const {
    email,
    password
  } = req.body; // const email = req.body.email
  //TODO: Mongoose doesn't work
  db.collection('users').findOne({
    email
  }, (err, user) => { // {email: email}
    if (err) {
      res.status(500).json({
        message: 'Server error'
      })
      return console.log('Error retrieving user', err);
    }
    console.log('User found', user);
    // res.json(user);
    // Check that we actually found a user with the specified email, and also that the password given matches the password for that user
    if (user && bcrypt.compareSync(password, user.password)) {
      // Successful login
      // Generate a signed JWT token which contains the user data
      const token = jwt.sign({
          _id: user._id,
          email: user.email,
          name: user.name
        },
        SERVER_SECRET_KEY, {
          expiresIn: '72h'
        }
      );
      res.json({
        user,
        token,
        success: true
      });
    } else {
      // Either user not found or password doesn't match
      res.status(401).json({
        message: 'Invalid email or password.'
      });
    }
  }); // findOne
}); // post user/login

app.post('/user/signup', (req, res) => {
  console.log('User signup data', req.body);
  const {
    name,
    email,
    suburb
  } = req.body;
  const password = bcrypt.hashSync(req.body.password, 10)
  db.collection('users').insertOne({name, email, password, suburb}, (err, user) => {
    if (err) {
      res.status(500).json({message: 'Server error'})
      return console.log('Error inserting user', err);
    }
    console.log('User added', user);
    const token = jwt.sign({
        _id: user._id,
        email: user.email,
        name: user.name
      },
      SERVER_SECRET_KEY, {
        expiresIn: '72h'
      }
    );
    res.json({
      user,
      token,
      success: true
    });
  })
}); // post user/signup




// Define an error handler function for express to use whenever there is an authentication error
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.log('Unauthorized Request', req.path);
    res.status(401).json({
      error: 'Invalid token'
    });
  }
}); // error handler