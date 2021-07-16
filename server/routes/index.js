const express = require('express');
const app = express();

app.use(require('./sede'));
app.use(require('./roomType'));

module.exports = app;