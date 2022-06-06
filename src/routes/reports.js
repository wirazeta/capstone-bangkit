const express = require('express');
const route = express.Router();
const multer = require('../multer');
const path = require('path');
const db = require('../Database/db');
const uploadImage = require('../helper');

route.post('/input', multer.single('img'), (req, res) => {
    //req.body.img (key = img);

    let filepath = uploadImage(req.file);

    let email = req.query.email;
    let content = req.body.content;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;

    if(latitude === undefined){
        latitude = 0.0;
    }

    if(longitude === undefined){
        longitude = 0.0;
    }
    // console.log(req);

    if(filepath === undefined || email === undefined || content === undefined){
        return res.status(400).send({
            status: 'fail',
            message: 'Upload error, please try again'
        });
    }
    const query = `INSERT INTO report (Email, Content, Image, Likes, Latitude, Longitude) VALUES ("${email}","${content}","${filepath}", 0, ${latitude}, ${longitude});`;
    db.getConn((errdb,connect) => {
        if(errdb)return res.status(500).send("Connection Database Failed");
        connect.query(query, (err,result) => {
            if(err)throw err;
            res.status(200).json({
                status : "success",
                message : "Insert Success"
            });
        })
    })
});

route.get('/', (req, res) => {
    const query = `SELECT * FROM report`;
    db.getConn((errdb, connect) => {
        if(errdb) return res.status(500).send("Connection Database Failed");
        connect.query(query, (err, result) => {
            if(err) throw err;
            const reports = JSON.parse(JSON.stringify(result));
            res.status(200).json({
                status: "success",
                message: "Get All Report",
                data: reports
            });
        })
    })
})

route.get('/:id', (req, res) => {
    const query = `SELECT * FROM report WHERE ReportID = ${req.params.id}`;
    db.getConn((errdb, connect) => {
        if(errdb) return res.status(500).send("Connection Database Failed");
        connect.query(query, (err, result) => {
            if(err) res.status(404).json({
                status: 'fail',
                message: 'Report Not Found'
            });
            const reports = JSON.parse(JSON.stringify(result[0]));
            res.status(200).json({
                status: "success",
                message: `Get Data With ID ${req.params.id}`,
                data: reports
            });
        })
    })
})

route.get('/:id/Likes', (req, res) => {
    const query = `SELECT Likes FROM report WHERE ReportID = ${req.params.id}`;
    db.getConn((errdb, connect) => {
        if(errdb) return res.status(500).send("Connection Database Failed");
        connect.query(query, (err, result) => {
            if(err) if(err) res.status(404).json({
                status: 'fail',
                message: 'Report Not Found'
            });;
            const reports = JSON.parse(JSON.stringify(result[0]));
            res.status(200).json({
                status: "Success",
                message: `Get Data With ID ${req.params.id}`,
                data: reports
            });
        })
    })
})

route.put('/:id/likes/input', (req, res) => {
    const query = `UPDATE report SET Likes = Likes+${req.query.like} WHERE ReportID = ${req.params.id}`;
    db.getConn((errdb, connect) => {
        if(errdb) return res.status(500).send("Connection Database Failed");
        connect.query(query, (err, result) => {
            if(err)if(err) res.status(404).json({
                status: 'fail',
                message: 'Report Not Found'
            });
            res.status(200).json({
                status: "success",
                message: "Likes Inserted"
            });
        })
    })
})

route.delete('/:id', (req, res) => {
    const query = `DELETE FROM report WHERE ReportID = ${req.params.id}`;
    db.getConn((errdb,connect) => {
        if(errdb) return res.status(500).send("Connection Database Failed");
        connect.query(`DELETE FROM comment WHERE ReportID = ${req.params.id}`, (err, result) => {
                if(err) throw err;
        })
        connect.query(query, (err, result) => {
            if(err) if(err) res.status(404).json({
                status: 'fail',
                message: 'Report Not Found'
            });
            res.status(200).json({
                status: "success",
                message: `Data ID ${req.params.id} has been delete`
            });
        })
    })
})

route.post('/:id/comments/input', (req, res) => {

    const query = `INSERT INTO comment(ReportID, Content, Email) VALUES ("${req.params.id}", "${req.query.content}", "${req.query.email}")`;
    if(req.params.id === undefined || req.query.content === undefined || req.query.email === undefined){
        return res.status(400).send({
            status: 'fail',
            message: 'Upload error, please try again'
        });
    }
    db.getConn((errdb, connect) => {
        if(errdb) return res.status(500).send("Connection Database Failed");
        connect.query(query, (err, result) => {
            if(err)throw err;
            res.status(200).json({
                status: 'success',
                message: `Comment for report ID ${req.params.id} inserted`
            });
        });
    })
});

route.delete('/:id/comment/:commentId', (req, res) => {
    const query = `DELETE FROM comment WHERE CommentID = ${req.params.commentId}`;
    db.getConn((errdb, connect) => {
        if(errdb) return res.status(500).send("Connection Database Failed");
        connect.query(query, (err, result) => {
            if(err) if(err) res.status(404).json({
                status: 'fail',
                message: 'Comment Not Found'
            });
            res.status(200).json({
                status: "success",
                message: `Comment ID ${req.params.commentId} for report ID ${req.params.id} has been delete`
            });
        });
    })
});

route.get('/:id/comments/', (req, res) => {
    const query = `SELECT * FROM comment WHERE ReportID = ${req.params.id}`;
    db.getConn((errdb, connect) => {
        if(errdb) return res.status(500).send("Connection Database Failed");
        connect.query(query, (err, result) => {
            if(err)throw err;
            const comments = JSON.parse(JSON.stringify(result));
            res.status(200).json({
                status: 'success',
                message: `Get All Comment For Report ID ${req.params.id}`,
                data: comments
            });
        });
    })
});

route.get('/:id/comments/:commentId', (req, res) => {
    const query = `SELECT * FROM comment WHERE ReportID = ${req.params.id} AND CommentID = ${req.params.commentId}`;
    db.getConn((errdb, connect) => {
        if(errdb) res.status(500).send('Connection Database Failed');
        connect.query(query, (err, result) => {
            if(err) res.status(404).json({
                status: 'fail',
                message: 'Comment Not Found'
            });
            const comments = JSON.parse(JSON.stringify(result[0]));
            res.status(200).json({
                status: 'success',
                message: `Get All Comment For Report ID ${req.params.id}`,
                data: comments
            });
        });
    })
});

route.get('/search', (req, res) => {
    const query = `SELECT * FROM report WHERE content LIKE %${req.body.content}%`;
    db.getConn((errdb, connect) => {
        if(errdb) res.status(500).send("Connection Database Failed");
        connect.query(query, (err, result) => {
            if(err) res.send(404).json({
                status: 'fail',
                message: 'Report Not Found'  
            });
            const report = JSON.parse(JSON.stringify(result[0]));
            res.status(200).json({
                status: 'success',
                message: `Get Report`,
                data: report
            });
        })
    })
})

module.exports = route;