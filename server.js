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
// const db = mongoose.connection;
const User = require('./models/User');
const Admin = require('./models/Admin');
const Case = require('./models/Case');

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

const createCase = (adminId, cases) => {
  return Case.create(cases).then(newCase => {
    console.log('Case created', newCase);
    return Admin.findByIdAndUpdate(
      adminId,
      { $push: { cases: newCase._id } },
      { new: true, useFindAndModify: false }
    );
  });
}; // createCase

const getAdminWithPopulate = (id) => {
  return Admin.findById(id).populate("cases");
}; // getAdminWithPopulate

/* ----------------------- Suburb ----------------------- */

const fs = require('fs');
const suburbsFile = fs.readFileSync('suburbs.json');
let suburbs = JSON.parse(suburbsFile);
suburbs = suburbs.data.filter(suburb => suburb.state_name === 'New South Wales');
// console.log(suburbs);
const filteredSuburbs = suburbs.map(({suburb, postcode}) => ({
  suburb, postcode
}));
// console.log(filteredSuburbs);
const filteredSuburbsArray = [];
filteredSuburbs.forEach(suburb => {
  filteredSuburbsArray.push(suburb.suburb);
});

app.get('/suburbs', (req, res) => {
  console.log('Getting all suburbs');
  res.json(filteredSuburbsArray);
}) // get /suburbs

/* ----------------------- Routes ----------------------- */

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to covid-19 Tracker.' });
});

app.get('/users', (req, res) => {
  console.log('Find user', res.body);
}); // get /users

app.post('/user/login', (req, res) => {
  console.log('User login data', req.body);
  // res.json(req.body); // echo back the POSTed form data
  const {
    email,
    password
  } = req.body; // const email = req.body.email
  User.findOne({email}, (err, user) => { // {email: email}
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
}); // post /user/login

app.post('/user/signup', (req, res) => {
  console.log('User signup data', req.body);
  const {
    name,
    email,
    suburb
  } = req.body;
  User.findOne({email}).then((user) => {
    if (user) {
      res.status(401).json({email: 'Email has been taken.'});
      return console.log('Email exists');
    } else {
      const password = bcrypt.hashSync(req.body.password, 10)
      User.create({name, email, password, suburb}, (err, user) => {
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
      }) // create user
    }
  });
}); // post /user/signup

app.post('/admin/login', (req, res) => {
  console.log('Admin login data', req.body);
  const {
    email,
    password
  } = req.body;
  Admin.findOne({email}, (err, admin) => { // {email: email}
    if (err) {
      res.status(500).json({
        message: 'Server error'
      })
      return console.log('Error retrieving admin', err);
    }
    console.log('Admin found', admin);
    // res.json(admin);
    // Check that we actually found a admin with the specified email, and also that the password given matches the password for that admin
    if (admin && bcrypt.compareSync(password, admin.password)) {
      // Successful login
      // Generate a signed JWT token which contains the admin data
      const token = jwt.sign({
          _id: admin._id,
          email: admin.email,
          name: admin.name
        },
        SERVER_SECRET_KEY, {
          expiresIn: '24h'
        }
      );
      res.json({
        admin,
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
}); // post /admin/login

app.get('/cases', checkAuth(), (req, res) => {
  Case.find({},(err, result) => {
    if (err) {
      console.log('Query err', err);
      return res.sendStatus(500);
    }
    res.json(result);
  }); // find cases
}); // get /cases

app.post('/cases/create', async (req, res) => {
  try {
    console.log('New case data', req.body);
    const {
      suburb,
      location,
      day,
      month,
      year,
      startTime,
      endTime
    } = req.body;
    let admin = await Admin.findOne({_id: req.body.adminID}, (err, admin) => {
      if (err) {
        res.sendStatus(500);
        return console.log('Finding admin', err);
      }
      console.log('Admin found');
    }); // findOne admin
    console.log(admin);
    admin = await createCase(admin._id, {
      location,
      suburb,
      year,
      month,
      day,
      startTime,
      endTime
    });
    admin = await getAdminWithPopulate(admin._id);
    res.json({admin});
  } catch (err) {
    console.log('Error creating case', err);
  } // try
}); // post /cases/create

app.post('/cases/delete', async (req, res) => {
  try {
    console.log('Delete case', req.body.caseId, req.body.adminId);
    Case.deleteOne({_id: req.body.caseId}, (err, result) => {
      if (err) {
        res.status(500).json({
          message: 'Server error'
        })
        return console.log('Error deleting case', err);
      }
      console.log(result);
    })
    let admin = await Admin.findOne({_id: req.body.adminId}).populate('cases');
    console.log(admin);
    res.json({
      cases: admin.cases
    });
  } catch (err) {
    console.log('Error deleting case', err);
  } // try
}); // post /cases/delete/:caseId

app.get('/cases/:caseId', async (req, res) => {
  try {
    console.log('Get single case', req.params.caseId);
    Case.findOne({_id: req.params.caseId}, (err, singleCase) => {
      if (err) {
        res.sendStatus(500);
        return console.log('Finding case', err);
      }
      res.json({singleCase});
    }); // findOne case
  } catch (err) {
    console.log('Error getting single case', err);
  }; // try
}); // get /cases/:caseId

app.post('/cases/edit', async (req, res) => {
  try {
    console.log('Update case', req.body);
    const {
      suburb,
      location,
      day,
      month,
      year,
      startTime,
      endTime
    } = req.body;
    let updateCase = await Case.findOneAndUpdate({_id: req.body.caseId}, {
      suburb,
      location,
      day,
      month,
      year,
      startTime,
      endTime
    }, {new: true});
    res.json({updateCase});
  } catch (err) {
    console.log('Error updating case', err);
  }; // try
}); // post /cases/edit

app.get('/admin/profile/:adminId', async (req, res) => {
  try {
    console.log('Admin profile adminId', req.params.adminId);
    let admin = await Admin.findOne({_id: req.params.adminId}).populate('cases');
    console.log(admin);
    res.json({
      admin: admin,
      cases: admin.cases
    });
  } catch (err) {
    console.log('Error getting admin profile', err);
  }
}); // get /admin/:adminId

// Define an error handler function for express to use whenever there is an authentication error
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.log('Unauthorized Request', req.path);
    res.status(401).json({
      error: 'Invalid token'
    });
  }
}); // error handler