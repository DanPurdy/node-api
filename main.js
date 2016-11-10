const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const config = require('./config/settings'); // get db config file
const auth = require('./app/routes/auth');
const index = require('./app/routes/index');
const users = require('./app/routes/users');

const app = express();
const port = process.env.PORT || 8080;
const securityOptions = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.crt'),
  requestCert: false,
};
const corsOptions = {
  origin: 'https://localhost:8000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const secureServer = require('https').createServer(securityOptions, app);


require('./config/passport')(passport);

// get our request parameters
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());
app.use(cors(corsOptions));

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
secureServer.listen(port);
console.log(`The api is listening at: http://localhost:${port}`); // eslint-disable-line no-console

// connect to database
mongoose.connect(config.database);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});
