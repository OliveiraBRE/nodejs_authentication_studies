const path = require('path');
const express = require('express');
const loginRoute = require('./routes/loginRoute');

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRoute);

module.exports = app;