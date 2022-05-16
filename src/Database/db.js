// database adalah db_api dengan tavel bernama members
const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'capstone_bangkit'
});

var getConnection = (callback) => {
  pool.getConnection((err, connection) => {
      callback(err, connection);
    });
};

module.exports = {
	getConn: getConnection,
}