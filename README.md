# Node API

This project is the foundation of a basic Node based API utilising JWT authentication.

I'm using the following

* Express
* Passport
* Helmet
* JWT
* MongoDb

## Requirements

* Node 6.x and above
* You'll need to have MongoDb installed and running on your system or remotely and have created a database

## Setup

### Install the dependencies

`npm i`

You'll need to create a config file for the application. A dist file is provided in `config/settings.dist.js`.

Make a copy of this file and name it `settings.js` with the following command

`cp config/settings.dist.js config/settings.js`

Inside this file you can add the requirements for the application such as the following

```javascript
module.exports = {
  secret: 'supersecretpassword',
  database: 'mongodb://127.0.0.1:27017/nodeApiDb',
  corsAddress: 'https://localhost:8000'
};
```

Make sure to point the database address to the correct IP port and Database name. In the above config my database is named nodeApiDb.

**CORS SUPPORT**

Please add the url for the web application you wish to connect to the API to in the `corsAddress` field in the settings file.

### Profit

#### Production build

`node main.js --production`

#### Development build

`node main.js`

> To keep the server running in the event of an unexpected error etc I recommend installing Nodemon globally `npm i -g nodemon` and then starting the server with `npm i -g nodemon`

You should now have the server up and running at https://localhost/8080

You can use the webapp located at https://github.com/DanPurdy/angular-profile to use the API with an Angular Js application
