require('dotenv').config();
const path = require('path');
const session = require('express-session')
const MongoSession = require('connect-mongodb-session')(session);
const express = require('express');
const loginRoute = require('./routes/loginRoute');

const app = express();

const connectString = process.env.CONNECTSTRING.replace('<PASSWORD>', process.env.MONGODBPSW);

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const store = new MongoSession({
  uri: connectString,
  collection: 'sessions'
});

app.use(session({
  secret: "my secret",
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use('/', loginRoute);

module.exports = app;