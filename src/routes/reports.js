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

route.put('/:id/likes', (req, res) => {
    const query = `UPDATE report SET Likes = Likes+${req.query.like} WHERE ReportID = ${req.params.id}`;
    database.query(query, (err, result) => {
        if(err)throw err;
        res.status(200).send("Likes Inserted");
    })
})

route.delete('/:id', (req, res) => {
    const query = `DELETE FROM report WHERE ReportID = ${req.params.id}`;
    database.query(query, (err, result) => {
        if(err) throw err;
        res.status(200).send(`Data ID ${req.params.id} deleted.`);
    })
})

route.post('/:id/comment/input', (req, res) => {
    const query = `INSERT INTO comment(ReportID, Content, Email) VALUES ("${req.params.id}", "${req.query.content}", "${req.query.email}")`;
    database.query(query, (err, result) => {
        if(err)throw err;
        res.status(200).send("Comment Inserted");
    });
});

route.delete('/:id/comment/:commentId', (req, res) => {
    const query = `DELETE FROM comment WHERE CommentID = ${req.params.commentId}`;
    database.query(query, (err, result) => {
        if(err)throw err;
        res.status(200).send("Comment Deleted");
    });
});

route.get('/:id/comment/', (req, res) => {
    const query = `SELECT * FROM comment WHERE ReportID = ${req.params.id}`;
    database.query(query, (err, result) => {
        if(err)throw err;
        res.status(200).send(result);
    });
});

route.get('/:id/comment/:commentId', (req, res) => {
    const query = `SELECT * FROM comment WHERE ReportID = ${req.params.id} AND CommentID = ${req.params.commentId}`;
    database.query(query, (err, result) => {
        if(err)throw err;
        res.status(200).send(result);
    });
});

module.exports = route;