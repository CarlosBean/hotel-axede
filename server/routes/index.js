const express = require('express');
const app = express();

app.use(require('./sede'));
app.use(require('./roomType'));
app.use(require('./reservation'));

module.exports = app;