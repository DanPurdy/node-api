const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/settings'); // get db config file
const auth = require('./app/routes/auth');
const index = require('./app/routes/index');
const users = require('./app/routes/users');

const app = express();
const port = process.env.PORT || 8080;

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('Nothing to see here');
});
app.use(helmet());
app.use('/api', index, auth);
app.use('/api/users', users);

// Start the server
app.listen(port);
console.log(`The api is listening at: http://localhost:${port}`); // eslint-disable-line no-console

// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);
