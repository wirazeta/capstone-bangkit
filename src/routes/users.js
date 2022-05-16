var express = require("express");
var app = express();
const jwt = require("jsonwebtoken");
const fs = require('fs')
const db = require('../Database/db');

// var users = require('./routes/users')
// var products = require('./routes/products')

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const { isAuthorized } = require("./auth");
var methodOverride = require('method-override');
const { error } = require("console");
app.use(methodOverride((req, res) => {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
}))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,recording-session,X-Auth-Token,Authorization");
	res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.options('*', (req, res) => { res.sendStatus(200); });

app.get('/', (req, res) => {
    res.send('<html><body><h1>NodeJS MySQL CRUD Rest API JSON</h1></body></html>')
})

app.get('/jwt', (req, res) => {
    let privateKey = fs.readFileSync('./private.pem', 'utf8');
    let token = jwt.sign(
        { "body": "stuff" }, privateKey, { algorithm: 'HS256'});
    res.send(token);
})

//*catatan* ini bagian login

app.post("/login", (req, res) => {
        let s_email = req.body.email;
        let s_Password = req.body.Password;

        db.getConn((errdb, conn) => {
            if (errdb) { return res.status(500).send("Gagal Terkoneksi"); }
            //tabel yang digunakan bernama "user"
            conn.query('SELECT * FROM user where email=?', s_email, (err, results, fields) => {
                    conn.release();
                    if (err) { return res.status(400).send("Error"); }
                    if (results) {
                        console.log(s_Password);
                        if (results.length > 0 && results[0].Password == s_Password) {
                            let privateKey = fs.readFileSync('./private.pem', 'utf8');
                            let payload = {
                                "Name": results[0].Name,
                                "email": results[0].email,
                                "phone_number": results[0].phone_number,
                            };
                            let token = jwt.sign(payload, privateKey, { algorithm: 'HS256' });
                            //keterangan hasil berhasil
                            res.status(200).json({
                                status:1,
                                message:"Login Berhasil",
                                data:payload,
                                token:token
                            });
                        } else {
                            //keterangan hasil gagal
                            return res.status(401).json({
                                status:0,
                                message:"Username atau Password Salah"
                            });
                        }
                    } else {
                        //keterangan hasil gagal
                        return res.status(401).json({
                            status:0,
                            message:"Terjadi Kesalahan Teknis atau Cek Kembali Username dan Password Anda"
                        });
                    }
            });
        });
})

//*catatan* ini bagian registration

app.post("/registration", function (req, res) {
	let sName = req.body.Name;
    let semail = req.body.email;
    let sphone_number = req.body.phone_number;
    let sPassword = req.body.Password;

    console.log(req.body);

    db.getConn((errdb, conn) => {
        if(errdb){ return res.status(500).send("Gagal Terkoneksi"); }
        //tabel yang digunakan bernama "user"
        conn.query("INSERT INTO user (Name, email, phone_number, Password) values(?, ?, ?, ?)",
            [sName, semail, sphone_number, sPassword ], function (err, results, fields) {
                conn.release();
            if (err) { 
                console.log(err);
                //keterangan hasil gagal
                return res.status(400).json({
                    status:0,
                    message:"Registrasi Gagal"
                }) }
                //keterangan hasil berhasil
            return res.json({
                status:1,
                message:"Registrasi Berhasil",
                data:req.body
            })
        })
    })
})

// *catatan* untuk user telah login atau belum
app.get('/loggedIn', isAuthorized, (req,res)=>{
    res.status(200).json({
        status:1, 
        message:"You are authorized"
    })
})

//catatan untuk bagian routes
// app.use('/api', users)
// app.use('/api', products)

module.exports = app;