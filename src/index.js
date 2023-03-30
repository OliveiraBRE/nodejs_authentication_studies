require('dotenv').config();
const mongoose = require('mongoose');
// const session = require('express-session')
// const MongoSession = require('connect-mongodb-session')(session);
const app = require('./app');

const port = process.env.PORT || 3000;
const connectString = process.env.CONNECTSTRING.replace('<PASSWORD>', process.env.MONGODBPSW);

// const store = new MongoSession({
//   uri: connectString,
//   collection: 'sessions'
// });

// app.use(session({
//   secret: "my secret",
//   resave: false,
//   saveUninitialized: false,
//   store: store
// }));

mongoose.connect(connectString)
.then(() => {
  app.listen(port);
})
.catch(error => console.error(error));