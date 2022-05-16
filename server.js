const express = require('express');
const database = require('./src/Database/db');
const report = require('./src/routes/reports');
const app = express();
const users = require('./src/routes/users');

app.use('/report', report);
app.use('/',users);

app.listen(3000, () => {
    console.log(`Server start at port 3000`);
})