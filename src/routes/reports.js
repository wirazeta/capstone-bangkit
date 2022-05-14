const express = require('express');
const database = require('../Database/db');
const route = express.Router();
const multer = require('../multer');
const path = require('path');
const db = require('../Database/db');

route.post('/input', multer.single('img'), (req, res) => {
    let filepath = '../uploads/' + req.file.filename;
    let email = req.query.email;
    let content = req.body.content;
    const query = `INSERT INTO report (Email, Content, Image, Likes) VALUES ("${email}","${content}","${filepath}", 0);`;
    db.query(query, (err,result) => {
        if(err)throw err;
        res.status(200).send('Report Inserted');
    })
});

route.get('/', (req, res) => {
    const query = `SELECT * FROM report`;
    database.query(query, (err, result) => {
        if(err) throw err;
        const reports = JSON.parse(JSON.stringify(result));
        res.status(200).send(reports);
    })
})

route.get('/:id', (req, res) => {
    const query = `SELECT * FROM report WHERE ReportID = ${req.params.id}`;
    database.query(query, (err, result) => {
        if(err) throw err;
        const reports = JSON.parse(JSON.stringify(result[0]));
        res.status(200).send(reports);
    })
})

// route.put('/:id', (req, res) => {
//     const query = `UPDATE report set Likes = `;
// })

route.delete('/{id}', (req, res) => {
    const query = `DELETE FROM report WHERE ReportID = ${req.params.reportId}`;
    database.query(query, (err, result) => {
        if(err) throw err;
        res.status(200).send(`Data ID ${req.params.reportId} deleted.`);
    })
})

route.post('/:id/comment/input', (req, res) => {
    let email = req.query.email;
    let reportId = req.params.id;
    // let content = req.body.content;

    return res.json(req.query);

    const query = `INSERT INTO comment (Email, ReportID, Content) VALUES ("${email}","${reportId}","${content}");`
    database.query(query, (err, result) => {
        if(err)throw err;
        res.status(200).send('Comment inserted');
    })
});

module.exports = route;