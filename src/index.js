require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;
const connectString = process.env.CONNECTSTRING.replace('<PASSWORD>', process.env.MONGODBPSW);

mongoose.connect(connectString)
.then(() => {
  app.listen(port);
})
.catch(error => console.error(error));