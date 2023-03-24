const express = require('express');
const loginRoute = require('./routes/loginRoute');

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/login', loginRoute);

module.exports = app;