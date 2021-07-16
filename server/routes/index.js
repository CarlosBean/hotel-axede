const express = require('express');
const app = express();

app.use(require('./sede'));

module.exports = app;