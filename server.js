const express = require('express');
const database = require('./src/Database/db');
const report = require('./src/routes/reports');
const app = express();

app.use('/report', report);

app.listen(3000, () => {
    console.log(`Server start at port 3000`);
})